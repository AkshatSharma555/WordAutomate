import path from "path";
import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import axios from "axios";
import cloudinary from "../config/cloudinary.js";
import documentModel from "../models/documentModel.js";
import userModel from "../models/userModel.js";
import sharedDocModel from "../models/sharedDocModel.js";

// Helper to safely delete files
const deleteFile = (filePath) => {
    try {
        if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (err) {
        console.error(`Error deleting file: ${filePath}`, err);
    }
};

// 1. GENERATE DOCUMENT
export const generateDocument = async (req, res) => {
    let tempDocPath = null;
    let outputPdfPath = null;
    let driveFileId = null;

    try {
        if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

        // Parse Data
        const student = JSON.parse(req.body.studentData || "{}");
        if (!student.name) return res.status(400).json({ success: false, message: "Student data missing" });

        const user = await userModel.findById(req.userId).select('+microsoftAccessToken');
        if (!user || !user.microsoftAccessToken) {
            return res.status(401).json({ success: false, message: "Session Expired. Please reconnect Microsoft Account." });
        }

        // --- STEP 1: DUPLICATE CHECK & CLEANUP ---
        // Check karo ki kya is Student + File ka record pehle se hai?
        let existingDoc = await documentModel.findOne({
            userId: req.userId,
            originalName: req.file.originalname,
            studentPrn: student.prn || "N/A"
        });

        // Agar purana document hai, toh Cloudinary se purani file uda do
        if (existingDoc && existingDoc.generatedName) {
            try {
                // Public ID nikalne ka logic: folder_name/filename_without_extension
                const publicId = `wordautomate_docs/${existingDoc.generatedName.replace(/\.pdf$/i, '')}`;
                await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
                console.log("Old file deleted from Cloudinary");
            } catch (err) {
                console.log("Cloudinary delete skipped:", err.message);
            }
        }

        // --- STEP 2: WORD PROCESSING ---
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

        const timestamp = Date.now();
        const sanitizedName = student.name.replace(/\s+/g, '_'); 
        const tempFileName = `temp_${timestamp}_${sanitizedName}.docx`;
        tempDocPath = path.resolve("uploads", tempFileName);
        fs.writeFileSync(tempDocPath, buf);

        // --- STEP 3: MICROSOFT CONVERSION ---
        const uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/WordAutomate/${tempFileName}:/content`;
        const fileStream = fs.readFileSync(tempDocPath);
        
        const uploadResponse = await axios.put(uploadUrl, fileStream, {
            headers: {
                'Authorization': `Bearer ${user.microsoftAccessToken}`,
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            }
        });
        driveFileId = uploadResponse.data.id;

        const convertUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${driveFileId}/content?format=pdf`;
        const pdfResponse = await axios.get(convertUrl, {
            headers: { 'Authorization': `Bearer ${user.microsoftAccessToken}` },
            responseType: 'arraybuffer'
        });

        // Smart Naming
        const pdfFileName = getSmartFileName(
            req.file.originalname,
            user.name,
            user.prn || "",
            student.name,
            student.prn
        );

        outputPdfPath = path.resolve("uploads", `output_${timestamp}_${student.id}.pdf`);
        fs.writeFileSync(outputPdfPath, pdfResponse.data);

        // --- STEP 4: CLOUDINARY UPLOAD ---
        const uploadCloudResponse = await cloudinary.uploader.upload(outputPdfPath, {
            folder: "wordautomate_docs",
            resource_type: "raw", 
            public_id: pdfFileName,
            overwrite: true
        });

        // --- STEP 5: ATOMIC DB UPDATE (Upsert) ---
        // FindOneAndUpdate use karne se Race Condition nahi hogi.
        // Agar record hai toh update hoga, nahi hai toh naya banega.
        const updatedDoc = await documentModel.findOneAndUpdate(
            {
                userId: req.userId,
                originalName: req.file.originalname,
                studentPrn: student.prn || "N/A"
            },
            {
                generatedName: pdfFileName,
                pdfUrl: uploadCloudResponse.secure_url,
                studentName: student.name,
                updatedAt: Date.now()
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // Cleanup OneDrive
        await axios.delete(`https://graph.microsoft.com/v1.0/me/drive/items/${driveFileId}`, {
            headers: { 'Authorization': `Bearer ${user.microsoftAccessToken}` }
        });

        return res.status(200).json({
            success: true,
            studentId: student.id,
            name: student.name,
            pdfUrl: uploadCloudResponse.secure_url,
            docId: updatedDoc._id 
        });

    } catch (error) {
        console.error("Gen Error:", error.message);
        
        if (error.response && error.response.status === 401) {
            return res.status(401).json({ success: false, message: "Microsoft Token Expired." });
        }
        return res.status(500).json({ success: false, message: error.message });

    } finally {
        // --- STEP 6: GUARANTEED CLEANUP ---
        // Try/Catch/Success kuch bhi ho, ye files delete hongi hi hongi.
        if (req.file) deleteFile(req.file.path);
        if (tempDocPath) deleteFile(tempDocPath);
        if (outputPdfPath) deleteFile(outputPdfPath);
    }
};


export const shareDocument = async (req, res) => {
    try {
        const { documentId, receiverId } = req.body;
        const senderId = req.userId;

        if (!documentId || !receiverId) return res.json({ success: false, message: "Missing details" });

        const existingShare = await sharedDocModel.findOne({
            sender: senderId,
            receiver: receiverId,
            document: documentId
        });

        if (existingShare) return res.json({ success: true, message: "Already shared" });

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

const getSmartFileName = (originalName, creatorName, creatorPrn, studentName, studentPrn) => {
    let baseName = originalName.replace(/\.[^/.]+$/, ""); 
    
    const cleanCreatorName = creatorName ? creatorName.replace(/\s+/g, '') : "";
    const cleanCreatorFirst = creatorName ? creatorName.split(' ')[0] : "";
    const cleanCreatorPrn = creatorPrn ? String(creatorPrn).trim() : "";

    const cleanStudentName = studentName ? studentName.replace(/\s+/g, '') : "Student";
    const cleanStudentPrn = studentPrn ? String(studentPrn).trim() : "";

    let newName = baseName;

    if (cleanCreatorPrn && new RegExp(cleanCreatorPrn, 'i').test(newName)) {
        newName = newName.replace(new RegExp(cleanCreatorPrn, 'gi'), cleanStudentPrn);
    }

    if (cleanCreatorName && new RegExp(cleanCreatorName, 'i').test(newName)) {
        newName = newName.replace(new RegExp(cleanCreatorName, 'gi'), cleanStudentName);
    } else if (cleanCreatorFirst && new RegExp(cleanCreatorFirst, 'i').test(newName)) {
        newName = newName.replace(new RegExp(cleanCreatorFirst, 'gi'), cleanStudentName);
    }

    if (!newName.toLowerCase().includes(cleanStudentName.toLowerCase())) {
        newName = `${newName}_${cleanStudentName}`;
    }

    if (cleanStudentPrn && !newName.includes(cleanStudentPrn)) {
        newName = `${newName}_${cleanStudentPrn}`;
    }

    return newName.replace(/_+/g, '_') + ".pdf";
};