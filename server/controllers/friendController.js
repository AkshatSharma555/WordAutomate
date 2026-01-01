import userModel from "../models/userModel.js";
import friendRequestModel from "../models/friendRequestModel.js";

// 1. Request Bhejo (Send Friend Request)
export const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    
    const senderId = req.body.userId || req.user?._id;

    if (!senderId) {
        return res.json({ success: false, message: "User ID missing from request." });
    }

    if (senderId.toString() === receiverId) {
      return res.json({ success: false, message: "You cannot send a request to yourself." });
    }

    // Check karo pehle se request hai ya nahi
    const existingRequest = await friendRequestModel.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });

    if (existingRequest) {
      if (existingRequest.status === 'accepted') {
        return res.json({ success: false, message: "You are already friends." });
      }
      return res.json({ success: false, message: "Friend request already pending." });
    }

    const newRequest = new friendRequestModel({
      sender: senderId,
      receiver: receiverId
    });

    await newRequest.save();
    res.json({ success: true, message: "Friend request sent!" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 2. Request Accept/Reject Karo
export const respondToRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body; // action: 'accept' or 'reject'
    
    const userId = req.body.userId || req.user?._id;

    if (!userId) {
        return res.json({ success: false, message: "User ID missing." });
    }

    const request = await friendRequestModel.findById(requestId);

    if (!request) {
      return res.json({ success: false, message: "Request not found." });
    }

    // Check karo ki request issi user ke liye thi na?
    if (request.receiver.toString() !== userId.toString()) {
      return res.json({ success: false, message: "Unauthorized action." });
    }

    if (action === 'accept') {
      request.status = 'accepted';
      await request.save();
      res.json({ success: true, message: "Friend request accepted!" });
    } else {
      await friendRequestModel.findByIdAndDelete(requestId);
      res.json({ success: true, message: "Friend request rejected." });
    }

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 3. Mere Saare Friends Lao (For 'Friends' Page & PDF Generation List)
export const getMyFriends = async (req, res) => {
  try {
    const userId = req.body.userId || req.user?._id;

    if (!userId) {
        return res.json({ success: false, message: "User ID missing." });
    }

    // Wo saari requests dhundo jo 'accepted' hain aur main usme shamil hu
    const connections = await friendRequestModel.find({
      $or: [{ sender: userId }, { receiver: userId }],
      status: 'accepted'
    })
    // 👇 FIX: Yahan 'prn' add kiya hai. Pehle ye missing tha!
    .populate('sender', 'name email profilePicture branch year prn')
    .populate('receiver', 'name email profilePicture branch year prn');

    // List ko clean karo (sirf dost ka data chahiye, mera nahi)
    const friends = connections.map(conn => {
      if (conn.sender._id.toString() === userId.toString()) {
        return conn.receiver;
      } else {
        return conn.sender;
      }
    });

    res.json({ success: true, friends });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 4. Pending Requests Lao (For Notifications)
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.body.userId || req.user?._id;

    if (!userId) {
        return res.json({ success: false, message: "User ID missing." });
    }

    // Sirf wo requests jahan main receiver hu aur status pending hai
    const requests = await friendRequestModel.find({
      receiver: userId,
      status: 'pending'
    })
    // 👇 FIX: Yahan bhi 'prn' add kar diya (future proofing)
    .populate('sender', 'name email profilePicture branch year prn');

    res.json({ success: true, requests });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 5. Check Friendship Status (For 'Explore' Cards UI)
export const getFriendshipStatus = async (currentUserId, otherUserId) => {
    const conn = await friendRequestModel.findOne({
        $or: [
            { sender: currentUserId, receiver: otherUserId },
            { sender: otherUserId, receiver: currentUserId }
        ]
    });

    if (!conn) return 'none';
    if (conn.status === 'accepted') return 'friends';
    if (conn.sender.toString() === currentUserId.toString()) return 'sent';
    return 'received';
};

// 6. Withdraw Request
export const withdrawRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.body.userId || req.user?._id;

    if (!senderId) return res.json({ success: false, message: "User ID missing." });

    // Database se request delete karo
    const deletedRequest = await friendRequestModel.findOneAndDelete({
      sender: senderId,
      receiver: receiverId,
      status: 'pending' // Sirf pending request hi delete honi chahiye
    });

    if (deletedRequest) {
      return res.json({ success: true, message: "Request withdrawn successfully." });
    } else {
      return res.json({ success: false, message: "Request not found or already accepted." });
    }

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 7. Remove Friend (Future Proofing - Unfriend Logic)
export const removeFriend = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.body.userId || req.user?._id;

    const deleted = await friendRequestModel.findOneAndDelete({
      $or: [
        { sender: currentUserId, receiver: targetUserId, status: 'accepted' },
        { sender: targetUserId, receiver: currentUserId, status: 'accepted' }
      ]
    });

    if (deleted) res.json({ success: true, message: "Friend removed." });
    else res.json({ success: false, message: "Friend connection not found." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};