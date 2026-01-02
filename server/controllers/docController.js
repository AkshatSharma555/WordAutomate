import path from "path";
import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import axios from "axios";
import cloudinary from "../config/cloudinary.js";
import documentModel from "../models/documentModel.js";
import userModel from "../models/userModel.js";
import sharedDocModel from "../models/sharedDocModel.js"

const deleteFile = (filePath) => {
    try {
        if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (err) {
        console.error(`Error deleting file: ${filePath}`, err);
    }
};

export const generateDocument = async (req, res) => {
    let tempDocPath = null;
    let outputPdfPath = null;
    let driveFileId = null;

    try {
        if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

        // Parse Single Student Data
        const student = JSON.parse(req.body.studentData || "{}");
        if (!student.name) return res.status(400).json({ success: false, message: "Student data missing" });

        const user = await userModel.findById(req.userId).select('+microsoftAccessToken');
        if (!user || !user.microsoftAccessToken) {
            return res.status(401).json({ success: false, message: "Session Expired" });
        }

        // 1. Read & Replace
        const content = fs.readFileSync(req.file.path, "binary");
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

        doc.render({ 
            name: student.name, 
            NAME: student.name,
            prn: student.prn,
            PRN: student.prn 
        });

        const buf = doc.getZip().generate({ type: "nodebuffer", compression: "DEFLATE" });

        // 2. Temp File
        const timestamp = Date.now();
        const sanitizedName = student.name.replace(/\s+/g, '_');
        const tempFileName = `temp_${timestamp}_${sanitizedName}.docx`;
        tempDocPath = path.resolve("uploads", tempFileName);
        fs.writeFileSync(tempDocPath, buf);

        // 3. OneDrive Upload
        const uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/WordAutomate/${tempFileName}:/content`;
        const fileStream = fs.readFileSync(tempDocPath);
        
        const uploadResponse = await axios.put(uploadUrl, fileStream, {
            headers: {
                'Authorization': `Bearer ${user.microsoftAccessToken}`,
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            }
        });
        driveFileId = uploadResponse.data.id;

        // 4. Convert to PDF
        const convertUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${driveFileId}/content?format=pdf`;
        const pdfResponse = await axios.get(convertUrl, {
            headers: { 'Authorization': `Bearer ${user.microsoftAccessToken}` },
            responseType: 'arraybuffer'
        });

        const pdfFileName = `Doc_${sanitizedName}_${student.prn || 'NA'}.pdf`;
        outputPdfPath = path.resolve("uploads", `output_${timestamp}_${sanitizedName}.pdf`);
        fs.writeFileSync(outputPdfPath, pdfResponse.data);

        // 5. Cloudinary Upload
        const uploadCloudResponse = await cloudinary.uploader.upload(outputPdfPath, {
            folder: "wordautomate_docs",
            resource_type: "raw", 
            public_id: pdfFileName
        });

        // 6. DB Save
        const newDoc = new documentModel({
            userId: req.userId,
            originalName: req.file.originalname,
            generatedName: pdfFileName,
            pdfUrl: uploadCloudResponse.secure_url,
            studentName: student.name,
            studentPrn: student.prn || "N/A"
        });
        await newDoc.save();

        // 7. Cleanup OneDrive
        await axios.delete(`https://graph.microsoft.com/v1.0/me/drive/items/${driveFileId}`, {
            headers: { 'Authorization': `Bearer ${user.microsoftAccessToken}` }
        });

        // Cleanup Local Template (Important: Do not delete original req.file here if reusing, 
        // but since we send file every time, we delete it at end of request)
        deleteFile(req.file.path); 

        return res.status(200).json({
            success: true,
            studentId: student.id,
            name: student.name,
            pdfUrl: uploadCloudResponse.secure_url,
            docId: newDoc._id
        });

    } catch (error) {
        console.error("Gen Error:", error.message);
        if (req.file) deleteFile(req.file.path);
        
        if (tempDocPath) deleteFile(tempDocPath);
        if (outputPdfPath) deleteFile(outputPdfPath);

        const status = (error.response && error.response.status === 401) ? 401 : 500;
        return res.status(status).json({ success: false, message: error.message });
    }
};


export const shareDocument = async (req, res) => {
    try {
        const { documentId, receiverId } = req.body;
        const senderId = req.userId;

        if (!documentId || !receiverId) {
            return res.json({ success: false, message: "Missing details" });
        }

        // Check duplicate
        const existingShare = await sharedDocModel.findOne({
            sender: senderId,
            receiver: receiverId,
            document: documentId
        });

        if (existingShare) {
            return res.json({ success: true, message: "Already shared" });
        }

        const newShare = new sharedDocModel({
            sender: senderId,
            receiver: receiverId,
            document: documentId
        });

        await newShare.save();

        res.json({ success: true, message: "Shared successfully" });

    } catch (error) {
        console.error("Share Error:", error);
        res.json({ success: false, message: error.message });
    }
};