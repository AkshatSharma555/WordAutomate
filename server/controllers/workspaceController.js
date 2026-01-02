import sharedDocModel from "../models/sharedDocModel.js";
import documentModel from "../models/documentModel.js";

// 1. Get Analytics (Stats Bar)
export const getWorkspaceStats = async (req, res) => {
    try {
        const userId = req.userId;

        // Promise.all use kar rahe hain taaki saari queries ek saath chalein (Faster)
        const [receivedCount, sentCount, impactStats, totalGenerated] = await Promise.all([
            // 1. Total Files Received
            sharedDocModel.countDocuments({ receiver: userId }),
            
            // 2. Total Files Shared (Sent)
            sharedDocModel.countDocuments({ sender: userId }),
            
            // 3. Impact Score (Kitne logon ne mera bheja hua doc dekha?)
            sharedDocModel.countDocuments({ sender: userId, isSeen: true }),

            // 4. Total Documents I Generated (Originals)
            documentModel.countDocuments({ userId: userId })
        ]);

        // Impact Rate Calculate karte hain (e.g., 80% logo ne dekha)
        const impactRate = sentCount > 0 ? Math.round((impactStats / sentCount) * 100) : 0;

        res.json({
            success: true,
            stats: {
                received: receivedCount,
                sent: sentCount,
                impactScore: impactStats, // Total Views
                impactRate: impactRate,   // Percentage
                generated: totalGenerated
            }
        });

    } catch (error) {
        console.error("Stats Error:", error);
        res.json({ success: false, message: error.message });
    }
};

// 2. Fetch Files (Inbox vs Sent)
export const fetchWorkspaceFiles = async (req, res) => {
    try {
        const userId = req.userId;
        const { type } = req.query; // 'received' or 'sent'

        let query;
        let populateOptions;

        if (type === 'received') {
            // Agar Inbox hai: Mujhe Receiver hun, Sender ki details chahiye
            query = { receiver: userId };
            populateOptions = [
                { path: 'sender', select: 'name profilePicture email' }, // Sender info
                { path: 'document' } // File details (name, size, url)
            ];
        } else {
            // Agar Sent History hai: Main Sender hun, Receiver ki details chahiye
            query = { sender: userId };
            populateOptions = [
                { path: 'receiver', select: 'name profilePicture email' }, // Kisko bheja?
                { path: 'document' }
            ];
        }

        const files = await sharedDocModel.find(query)
            .populate(populateOptions)
            .sort({ sharedAt: -1 }); // Newest First

        // Data Cleaning: Kabhi kabhi document delete ho jata hai par share entry reh jati hai
        // Hum filter kar lenge taaki null documents UI na todein
        const cleanFiles = files.filter(f => f.document !== null).map(f => ({
            id: f._id,
            sharedAt: f.sharedAt,
            isSeen: f.isSeen,
            // Document Details
            fileName: f.document.generatedName,
            fileUrl: f.document.pdfUrl,
            originalName: f.document.originalName,
            // User Details (Dynamic based on tab)
            user: type === 'received' ? f.sender : f.receiver 
        }));

        res.json({ success: true, files: cleanFiles });

    } catch (error) {
        console.error("Fetch Files Error:", error);
        res.json({ success: false, message: error.message });
    }
};

// 3. Mark as Seen (Read Receipt)
export const markAsSeen = async (req, res) => {
    try {
        const { shareId } = req.body;
        
        await sharedDocModel.findByIdAndUpdate(shareId, { isSeen: true });

        res.json({ success: true, message: "Marked as seen" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};