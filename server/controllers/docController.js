import path from "path";
import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import axios from "axios";
import cloudinary from "../config/cloudinary.js";
import documentModel from "../models/documentModel.js";
import userModel from "../models/userModel.js";
import sharedDocModel from "../models/sharedDocModel.js";

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

        // Parse Single Student Data
        const student = JSON.parse(req.body.studentData || "{}");
        if (!student.name) return res.status(400).json({ success: false, message: "Student data missing" });

        const user = await userModel.findById(req.userId).select('+microsoftAccessToken');
        if (!user || !user.microsoftAccessToken) {
            return res.status(401).json({ success: false, message: "Session Expired. Please reconnect Microsoft Account." });
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
        // Sanitized name only for temp file logic, not final logic
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

        // ---------------------------------------------------------
        // 👇 UPDATED: Smart Renaming Logic Implementation 👇
        // ---------------------------------------------------------
        
        // Helper function ko call karke naya naam banayenge
        const pdfFileName = getSmartFileName(
            req.file.originalname,  // Original File Name (e.g., ADL_Exp1_Akshat.docx)
            user.name,              // Creator Name (e.g., Akshat Sharma)
            user.prn || "",         // Creator PRN 
            student.name,           // Receiver Name (e.g., Vedant Bhamare)
            student.prn             // Receiver PRN
        );

        // Local Output Path (Temp storage ke liye unique ID use karte hain taaki clash na ho)
        outputPdfPath = path.resolve("uploads", `output_${timestamp}_${student.id}.pdf`);
        fs.writeFileSync(outputPdfPath, pdfResponse.data);

        // ---------------------------------------------------------
        // 👆 UPDATE END 👆
        // ---------------------------------------------------------

        // 5. Cloudinary Upload
        const uploadCloudResponse = await cloudinary.uploader.upload(outputPdfPath, {
            folder: "wordautomate_docs",
            resource_type: "raw", 
            public_id: pdfFileName // Yeh naam Cloudinary aur User ko dikhega
        });

        // 6. DB Save
        const newDoc = new documentModel({
            userId: req.userId,
            originalName: req.file.originalname,
            generatedName: pdfFileName, // Database mein bhi Smart Name save hoga
            pdfUrl: uploadCloudResponse.secure_url,
            studentName: student.name,
            studentPrn: student.prn || "N/A"
        });
        await newDoc.save();

        // 7. Cleanup OneDrive
        await axios.delete(`https://graph.microsoft.com/v1.0/me/drive/items/${driveFileId}`, {
            headers: { 'Authorization': `Bearer ${user.microsoftAccessToken}` }
        });

        // Cleanup Local
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
        
        // Cleanup on Error
        if (req.file) deleteFile(req.file.path);
        if (tempDocPath) deleteFile(tempDocPath);
        if (outputPdfPath) deleteFile(outputPdfPath);

        // Specific handling for Microsoft Token Expiry
        if (error.response && error.response.status === 401) {
            return res.status(401).json({ 
                success: false, 
                message: "Microsoft Token Expired. Please logout and login again with Microsoft." 
            });
        }

        return res.status(500).json({ success: false, message: error.message });
    }
};

// 2. SHARE DOCUMENT API
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

// 3. SMART FILENAME GENERATION
const getSmartFileName = (originalName, creatorName, creatorPrn, studentName, studentPrn) => {
    // 1. Extension hatao (.docx)
    let baseName = originalName.replace(/\.[^/.]+$/, ""); 
    
    // 2. Names & PRNs ko Clean karo (Remove spaces)
    const cleanCreatorName = creatorName ? creatorName.replace(/\s+/g, '') : "";
    const cleanCreatorFirst = creatorName ? creatorName.split(' ')[0] : "";
    const cleanCreatorPrn = creatorPrn ? String(creatorPrn).trim() : "";

    const cleanStudentName = studentName ? studentName.replace(/\s+/g, '') : "Student";
    const cleanStudentPrn = studentPrn ? String(studentPrn).trim() : "";

    let newName = baseName;

    // 3. Logic: Replace Creator PRN -> Student PRN (Case Insensitive)
    if (cleanCreatorPrn && new RegExp(cleanCreatorPrn, 'i').test(newName)) {
        newName = newName.replace(new RegExp(cleanCreatorPrn, 'gi'), cleanStudentPrn);
    }

    // 4. Logic: Replace Creator Name -> Student Name
    // Pehle Full Name check karo
    if (cleanCreatorName && new RegExp(cleanCreatorName, 'i').test(newName)) {
        newName = newName.replace(new RegExp(cleanCreatorName, 'gi'), cleanStudentName);
    } 
    // Agar Full Name nahi mila, toh First Name check karo
    else if (cleanCreatorFirst && new RegExp(cleanCreatorFirst, 'i').test(newName)) {
        newName = newName.replace(new RegExp(cleanCreatorFirst, 'gi'), cleanStudentName);
    }

    // 5. SAFETY CHECK (Fallback): 
    // Agar replace hone ke baad bhi Student ka Naam usme nahi hai, toh end mein jod do
    if (!newName.toLowerCase().includes(cleanStudentName.toLowerCase())) {
        newName = `${newName}_${cleanStudentName}`;
    }

    // Agar Student ka PRN usme nahi hai, toh end mein jod do
    if (cleanStudentPrn && !newName.includes(cleanStudentPrn)) {
        newName = `${newName}_${cleanStudentPrn}`;
    }

    // 6. Final Cleanup (Remove messy underscores like "__") & Add .pdf
    return newName.replace(/_+/g, '_') + ".pdf";
};
