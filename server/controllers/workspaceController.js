import mongoose from "mongoose";
import sharedDocModel from "../models/sharedDocModel.js";
import documentModel from "../models/documentModel.js";

// 1. Get Analytics (Stats Bar)
export const getWorkspaceStats = async (req, res) => {
    try {
        const userId = req.userId;

        // Promise.all for parallel execution
        const [receivedCount, sentCount, impactStats, totalGenerated] = await Promise.all([
            // 1. Total Files Received
            sharedDocModel.countDocuments({ receiver: userId }),
            
            // 2. Total Files Shared (Sent)
            sharedDocModel.countDocuments({ sender: userId }),
            
            // 3. Impact Score (How many viewed my shared docs?)
            sharedDocModel.countDocuments({ sender: userId, isSeen: true }),

            // 4. Total Documents I Generated (Originals)
            documentModel.countDocuments({ userId: userId })
        ]);

        // Impact Rate (Percentage)
        const impactRate = sentCount > 0 ? Math.round((impactStats / sentCount) * 100) : 0;

        res.json({
            success: true,
            stats: {
                received: receivedCount,
                sent: sentCount,
                impactScore: impactStats,
                impactRate: impactRate,
                generated: totalGenerated
            }
        });

    } catch (error) {
        console.error("Stats Error:", error);
        res.json({ success: false, message: error.message });
    }
};

// 2. Fetch Files (Inbox vs Sent - With Smart Grouping)
export const fetchWorkspaceFiles = async (req, res) => {
    try {
        const userId = req.userId;
        const { type } = req.query; // 'received' or 'sent'

        if (type === 'received') {
            // --- INBOX LOGIC (Single Files) ---
            const files = await sharedDocModel.find({ receiver: userId })
                .populate('sender', 'name profilePicture email')
                .populate('document')
                .sort({ sharedAt: -1 });

            // Filter out deleted documents
            const cleanFiles = files.filter(f => f.document).map(f => ({
                id: f._id,
                isBatch: false,
                sharedAt: f.sharedAt,
                isSeen: f.isSeen,
                fileName: f.document.generatedName,
                fileUrl: f.document.pdfUrl,
                user: f.sender
            }));
            
            return res.json({ success: true, files: cleanFiles });

        } else {
            // --- OUTBOX LOGIC (Smart Batch Grouping) ---
            const objectIdUserId = new mongoose.Types.ObjectId(userId);

            const groupedFiles = await sharedDocModel.aggregate([
                { $match: { sender: objectIdUserId } },
                // Join Document
                {
                    $lookup: {
                        from: "documents",
                        localField: "document",
                        foreignField: "_id",
                        as: "docDetails"
                    }
                },
                { $unwind: "$docDetails" },
                // Join Receiver
                {
                    $lookup: {
                        from: "users",
                        localField: "receiver",
                        foreignField: "_id",
                        as: "receiverDetails"
                    }
                },
                { $unwind: "$receiverDetails" },

                // STAGE 1: Group by File Name + Time (Minute precision for batching)
                {
                    $group: {
                        _id: {
                            originalName: "$docDetails.originalName",
                            batchTime: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$sharedAt" } }
                        },
                        timestamp: { $first: "$sharedAt" },
                        recipients: {
                            $push: {
                                shareId: "$_id",
                                name: "$receiverDetails.name",
                                img: "$receiverDetails.profilePicture",
                                isSeen: "$isSeen",
                                fileUrl: "$docDetails.pdfUrl"
                            }
                        }
                    }
                },

                // STAGE 2: Group by File Name ONLY (To gather history)
                {
                    $group: {
                        _id: "$_id.originalName", // Master Grouping Key
                        lastSharedAt: { $max: "$timestamp" },
                        totalBatches: { $sum: 1 },
                        allBatches: {
                            $push: {
                                batchTime: "$timestamp",
                                recipients: "$recipients",
                                count: { $size: "$recipients" }
                            }
                        }
                    }
                },
                { $sort: { lastSharedAt: -1 } }
            ]);

            // Format for Frontend
            const formattedFiles = groupedFiles.map(group => ({
                id: group._id, // Filename is the ID
                isMasterFile: true, // Marker
                fileName: group._id,
                lastShared: group.lastSharedAt,
                totalBatches: group.totalBatches,
                totalStudents: group.allBatches.reduce((acc, batch) => acc + batch.count, 0),
                batches: group.allBatches.sort((a, b) => new Date(b.batchTime) - new Date(a.batchTime))
            }));

            return res.json({ success: true, files: formattedFiles });
        }

    } catch (error) {
        console.error("Fetch Files Error:", error);
        res.json({ success: false, message: error.message });
    }
};

// 3. Mark as Seen
export const markAsSeen = async (req, res) => {
    try {
        const { shareId } = req.body;
        
        await sharedDocModel.findByIdAndUpdate(shareId, { isSeen: true });

        res.json({ success: true, message: "Marked as seen" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};