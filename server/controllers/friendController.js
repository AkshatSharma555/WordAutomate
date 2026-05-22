import userModel from "../models/userModel.js";
import friendRequestModel from "../models/friendRequestModel.js";

// 1. Request Bhejo (Send Friend Request)
export const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    
    // Using strict userId from middleware
    const senderId = req.userId;

    if (!senderId) {
        return res.json({ success: false, message: "User ID missing from request." });
    }

    if (senderId.toString() === receiverId) {
      return res.json({ success: false, message: "You cannot send a request to yourself." });
    }

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
    const { requestId, action } = req.body; 
    
    const userId = req.userId;

    if (!userId) {
        return res.json({ success: false, message: "User ID missing." });
    }

    const request = await friendRequestModel.findById(requestId);

    if (!request) {
      return res.json({ success: false, message: "Request not found." });
    }

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
    const userId = req.userId;

    if (!userId) {
        return res.json({ success: false, message: "User ID missing." });
    }

    const connections = await friendRequestModel.find({
      $or: [{ sender: userId }, { receiver: userId }],
      status: 'accepted'
    })
    .populate('sender', 'name email profilePicture branch year prn')
    .populate('receiver', 'name email profilePicture branch year prn');

    // 🔥 Ghost connections (deleted users) handling
    const friends = connections.map(conn => {
      if (!conn.sender || !conn.receiver) return null;

      if (conn.sender._id.toString() === userId.toString()) {
        return conn.receiver;
      } else {
        return conn.sender;
      }
    }).filter(friend => friend !== null); // Clean list jisme koi null na ho

    res.json({ success: true, friends });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 4. Pending Requests Lao (For Notifications)
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
        return res.json({ success: false, message: "User ID missing." });
    }

    const requests = await friendRequestModel.find({
      receiver: userId,
      status: 'pending'
    })
    .populate('sender', 'name email profilePicture branch year prn');

    // 🔥 Ghost request handling
    const validRequests = requests.filter(req => req.sender !== null);

    res.json({ success: true, requests: validRequests });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 5. Check Friendship Status (For 'Explore' Cards UI)
// 🔥 THIS WAS THE MISSING FUNCTION CAUSING THE CRASH
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
    const senderId = req.userId;

    if (!senderId) return res.json({ success: false, message: "User ID missing." });

    const deletedRequest = await friendRequestModel.findOneAndDelete({
      sender: senderId,
      receiver: receiverId,
      status: 'pending' 
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
    const currentUserId = req.userId;

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