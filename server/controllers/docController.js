import path from "path";
import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import axios from "axios";
import cloudinary from "../config/cloudinary.js";
import documentModel from "../models/documentModel.js";
import userModel from "../models/userModel.js";

const deleteFile = (filePath) => {
    try {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (err) {
        console.error(`Error deleting file: ${filePath}`, err);
    }
};

export const generateDocument = async (req, res) => {
    let tempDocPath = null;
    let outputPdfPath = null;
    let driveFileId = null;

    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No Word file uploaded" });
        }

        const studentData = JSON.parse(req.body.studentData || "{}");
        const name = studentData.name;
        const prn = studentData.prn || studentData.PRN;

        if (!name || !prn) {
            return res.status(400).json({ success: false, message: "Name and PRN are required" });
        }

        const user = await userModel.findById(req.userId).select('+microsoftAccessToken');
        
        if (!user || !user.microsoftAccessToken) {
            return res.status(401).json({ 
                success: false, 
                message: "Microsoft Session Expired. Please Logout and Login again." 
            });
        }

        const accessToken = user.microsoftAccessToken;

        const templatePath = req.file.path;
        const content = fs.readFileSync(templatePath, "binary");
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

        doc.render({ name: name, PRN: prn, prn: prn });

        const buf = doc.getZip().generate({ type: "nodebuffer", compression: "DEFLATE" });

        const timestamp = Date.now();
        const sanitizedName = name.replace(/\s+/g, '_');
        const tempFileName = `temp_${timestamp}_${sanitizedName}.docx`;
        tempDocPath = path.resolve("uploads", tempFileName);
        
        fs.writeFileSync(tempDocPath, buf);

        const uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/WordAutomate/${tempFileName}:/content`;
        const fileStream = fs.readFileSync(tempDocPath);

        const uploadResponse = await axios.put(uploadUrl, fileStream, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            }
        });

        driveFileId = uploadResponse.data.id;

        const convertUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${driveFileId}/content?format=pdf`;
        const pdfResponse = await axios.get(convertUrl, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            responseType: 'arraybuffer'
        });

        const pdfFileName = `Doc_${sanitizedName}_${prn}.pdf`;
        outputPdfPath = path.resolve("uploads", `output_${timestamp}.pdf`);
        fs.writeFileSync(outputPdfPath, pdfResponse.data);

        const uploadCloudResponse = await cloudinary.uploader.upload(outputPdfPath, {
            folder: "wordautomate_docs",
            resource_type: "raw", 
            public_id: pdfFileName
        });

        const newDoc = new documentModel({
            userId: req.userId,
            originalName: req.file.originalname,
            generatedName: pdfFileName,
            pdfUrl: uploadCloudResponse.secure_url,
            studentName: name,
            studentPrn: prn
        });

        await newDoc.save();

        res.status(200).json({
            success: true,
            message: "Document generated successfully",
            pdfUrl: uploadCloudResponse.secure_url,
            docId: newDoc._id
        });

    } catch (error) {
        console.error("Graph API Error:", error.response ? error.response.data : error.message);
        
        if (error.response && error.response.status === 401) {
            return res.status(401).json({ 
                success: false, 
                message: "Microsoft Token Expired. Please Logout and Login again." 
            });
        }

        res.status(500).json({ 
            success: false, 
            message: "Failed to generate document.",
            error: error.message 
        });

    } finally {
        if (req.file) deleteFile(req.file.path);
        if (tempDocPath) deleteFile(tempDocPath);
        if (outputPdfPath) deleteFile(outputPdfPath);

        if (driveFileId) {
            try {
                const user = await userModel.findById(req.userId).select('+microsoftAccessToken');
                if (user && user.microsoftAccessToken) {
                    await axios.delete(`https://graph.microsoft.com/v1.0/me/drive/items/${driveFileId}`, {
                        headers: { 'Authorization': `Bearer ${user.microsoftAccessToken}` }
                    });
                }
            } catch (cleanupErr) {
                console.error("OneDrive Cleanup Failed:", cleanupErr.message);
            }
        }
    }
};