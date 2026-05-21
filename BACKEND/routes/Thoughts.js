const express = require("express");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const Thought = require("../models/Thoughts");
const Chat = require("../models/Chat");
const CommunityUser = require("../models/CommunityUser");
const { sendEmail } = require("../controllers/MailController");
const router = express.Router();

// Post a new thought
router.post("/thoughts", auth, async (req, res) => {
  try {
    const { userId, text } = req.body;
    if (!userId || !text) {
      return res.status(400).json({ success: false, message: "userId and text are required" });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId format" });
    }
    const user = await CommunityUser.findById(userId).select("name");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const newThought = new Thought({
      userId,
      text,
      owner: user.name,
      visible: "show",
      replies: [],
    });
    const savedThought = await newThought.save();
    res.status(201).json({
      success: true,
      _id: savedThought._id,
      userId: savedThought.userId.toString(),
      owner: user.name,
      text: savedThought.text,
      visible: savedThought.visible,
      createdAt: savedThought.createdAt,
      replies: [],
    });
  } catch (error) {
    console.error("Error in /thoughts:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// Get all visible thoughts
router.get("/getthoughts", auth, async (req, res) => {
  try {
    const thoughts = await Thought.find({ visible: "show" })
      .populate("userId", "name")
      .populate("replies.userId", "name profile")
      .lean();
    res.status(200).json(
      thoughts.map((thought) => ({
        _id: thought._id,
        userId: thought.userId._id.toString(),
        owner: thought.userId?.name || "Unknown",
        text: thought.text,
        visible: thought.visible,
        createdAt: thought.createdAt,
        replies: thought.replies.map((reply) => ({
          userId: reply.userId._id.toString(),
          user: reply.userId?.name || "Unknown",
          profile: reply.userId?.profile || "",
          text: reply.text,
          visible: reply.visible,
          createdAt: reply.createdAt,
        })),
      }))
    );
  } catch (error) {
    console.error("Error in /getthoughts:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// Get thoughts by user ID
router.get("/communityposts/:userId", auth, async (req , res)=>{
   try{
      const { userId } = req.params;
      if(!userId){
         return res.status(400).json({ success: false, message: "User ID is required" });
      }

      const thoughts = await Thought.find({ userId: userId });
      res.status(200).json( {success: true, thoughts : thoughts} );

   } catch(error){
      console.error("Error in /communityposts/:userId:", error);
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
   }
})

// Post a reply to a thought
router.post("/thoughtsreplies/:id", auth, async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({ success: false, message: "Thought not found" });
    }
    const { userId, text, createdAt, visible } = req.body;
    if (!userId || !text) {
      return res.status(400).json({ success: false, message: "userId and text are required" });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId format" });
    }
    const user = await CommunityUser.findById(userId).select("name");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    thought.replies.push({ userId, text, createdAt, visible });
    await thought.save();
    const updatedThought = await Thought.findById(req.params.id)
      .populate("userId", "name")
      .populate("replies.userId", "name");
    res.status(200).json({
      success: true,
      _id: updatedThought._id,
      userId: updatedThought.userId._id.toString(),
      owner: updatedThought.userId?.name || "Unknown",
      text: updatedThought.text,
      visible: updatedThought.visible,
      createdAt: updatedThought.createdAt,
      replies: updatedThought.replies.map((reply) => ({
        userId: reply.userId._id.toString(),
        user: reply.userId?.name || "Unknown",
        text: reply.text,
        visible: reply.visible,
        createdAt: reply.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error in /thoughtsreplies/:id:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// Update thought visibility
router.put("/changevisible/:id", auth, async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({ success: false, message: "Thought not found" });
    }
    if (req.body.visible !== "show" && req.body.visible !== "hide") {
      return res.status(400).json({ success: false, message: "Invalid visibility value" });
    }
    thought.visible = req.body.visible;
    await thought.save();
    const updatedThought = await Thought.findById(req.params.id)
      .populate("userId", "name")
      .populate("replies.userId", "name");
    res.status(200).json({
      success: true,
      _id: updatedThought._id,
      userId: updatedThought.userId._id.toString(),
      owner: updatedThought.userId?.name || "Unknown",
      text: updatedThought.text,
      visible: updatedThought.visible,
      createdAt: updatedThought.createdAt,
      replies: updatedThought.replies.map((reply) => ({
        userId: reply.userId._id.toString(),
        user: reply.userId?.name || "Unknown",
        text: reply.text,
        visible: reply.visible,
        createdAt: reply.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error in /changevisible/:id:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// Update reply visibility
router.put("/changerepliesvisibilty/:thoughtId/replies/:replyIndex", auth, async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ success: false, message: "Thought not found" });
    }
    const reply = thought.replies[req.params.replyIndex];
    if (!reply) {
      return res.status(404).json({ success: false, message: "Reply not found" });
    }
    if (req.body.visible !== "show" && req.body.visible !== "hide") {
      return res.status(400).json({ success: false, message: "Invalid visibility value" });
    }
    reply.visible = req.body.visible;
    await thought.save();
    const updatedThought = await Thought.findById(req.params.thoughtId)
      .populate("userId", "name")
      .populate("replies.userId", "name");
    res.status(200).json({
      success: true,
      _id: updatedThought._id,
      userId: updatedThought.userId._id.toString(),
      owner: updatedThought.userId?.name || "Unknown",
      text: updatedThought.text,
      visible: updatedThought.visible,
      createdAt: updatedThought.createdAt,
      replies: updatedThought.replies.map((reply) => ({
        userId: reply.userId._id.toString(),
        user: reply.userId?.name || "Unknown",
        text: reply.text,
        visible: reply.visible,
        createdAt: reply.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error in /changerepliesvisibilty/:thoughtId/replies/:replyIndex:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// Send a friend request
router.post("/friendrequest", auth, async (req, res) => {
  const { senderId, targetId } = req.body;
  try {
    if (!senderId || !targetId) {
      return res.status(400).json({ success: false, message: "senderId and targetId are required" });
    }
    if (!mongoose.isValidObjectId(senderId) || !mongoose.isValidObjectId(targetId)) {
      return res.status(400).json({ success: false, message: "Invalid senderId or targetId format" });
    }
    const sender = await CommunityUser.findById(senderId).select("name");
    if (!sender) {
      return res.status(404).json({ success: false, message: "Sender not found" });
    }
    const target = await CommunityUser.findById(targetId).select("name friendRequests friends email");
    if (!target) {
      return res.status(404).json({ success: false, message: "Target user not found" });
    }
    if (senderId === targetId) {
      return res.status(400).json({ success: false, message: "Cannot add yourself as a friend" });
    }
    target.friendRequests = target.friendRequests || [];
    target.friends = target.friends || [];
    if (
      target.friends.some((friend) => friend.userId.toString() === senderId) ||
      target.friendRequests.some((req) => req.userId.toString() === senderId)
    ) {
      return res.status(400).json({ success: false, message: "Already friends or request pending" });
    }
    target.friendRequests.push({
      userId: new mongoose.Types.ObjectId(senderId),
      name: sender.name,
    });
    await target.save();
    const emailMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4A90E2; color: #fff; text-align: center; padding: 20px;">
          <h1>DOLTEC</h1>
        </div>
        <div style="padding: 20px; text-align: center;">
          <p style="font-size: 16px; color: #333;">Hello ${target.name},</p>
          <p style="font-size: 14px; color: #555;">You’ve received a new <strong>Friend Request</strong> from:</p>
          <p style="font-size: 20px; font-weight: bold; color: #4A90E2; margin: 10px 0;">${sender.name}</p>
          <p style="font-size: 14px; color: #555;">
            To view and respond to this request, please log in to your Doltec account.
          </p>
          <a href="https://www.doltec.in/CommunityLogin" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background-color: #4A90E2; color: #fff; text-decoration: none; border-radius: 4px;">
            Log In to Your Account
          </a>
          <p style="font-size: 12px; color: #888; margin-top: 20px;">
            If the button above doesn't work, copy and paste the following link into your browser:
          </p>
          <p style="font-size: 12px; color: #888;">
            <a href="https://www.doltec.in/CommunityLogin" style="color: #4A90E2;">https://www.doltec.in/CommunityLogin</a>
          </p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #888; padding: 10px 0; border-top: 1px solid #ddd;">
          <p>If you don’t recognize this request, you can safely ignore this email.</p>
          <p>&copy; 2025 Doltec Consultancy Services. All Rights Reserved.</p>
        </div>
      </div>
    `;
    try {
      await sendEmail({ email: target.email, subject: "You’ve Got a New Friend Request!", message: emailMessage });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
    }
    res.status(200).json({ success: true, message: "Friend request sent", senderName: sender.name, targetName: target.name });
  } catch (error) {
    console.error("Error in /friendrequest:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// Check friend status
router.get("/checkfriend/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "Invalid User ID format" });
    }
    const user = await CommunityUser.findById(userId)
      .select("friendRequests friends")
      .populate("friendRequests.userId", "name")
      .populate("friends.userId", "name");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.friendRequests = user.friendRequests || [];
    user.friends = user.friends || [];
    res.status(200).json({
      success: true,
      friendRequests: user.friendRequests.map((req) => ({
        userId: req.userId?._id.toString(),
        name: req.userId?.name || req.name || "Unknown",
      })) || [],
      friends: user.friends.map((friend) => ({
        userId: friend.userId?._id.toString(),
        name: friend.userId?.name || friend.name || "Unknown",
      })) || [],
    });
  } catch (error) {
    console.error("Error in /checkfriend/:userId:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// Accept a friend request
router.post("/acceptfriend", auth, async (req, res) => {
  const { senderId, userId } = req.body;
  try {
    if (!senderId || !userId) {
      return res.status(400).json({ success: false, message: "senderId and userId are required" });
    }
    if (!mongoose.isValidObjectId(senderId) || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "Invalid senderId or userId format" });
    }
    const user = await CommunityUser.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const sender = await CommunityUser.findById(senderId).select("name");
    if (!sender) {
      return res.status(404).json({ success: false, message: "Sender not found" });
    }
    user.friendRequests = user.friendRequests || [];
    user.friends = user.friends || [];
    if (!user.friendRequests.some((req) => req.userId.toString() === senderId)) {
      return res.status(400).json({ success: false, message: "No friend request from this user" });
    }
    user.friendRequests = user.friendRequests.filter((req) => req.userId.toString() !== senderId);
    user.friends.push({ userId: new mongoose.Types.ObjectId(senderId), name: sender.name });
    sender.friends = sender.friends || [];
    sender.friends.push({ userId: new mongoose.Types.ObjectId(userId), name: user.name });
    await Promise.all([user.save(), sender.save()]);
    const chat = await Chat.findOne({
      participants: { $all: [userId, senderId] },
    });
    if (!chat) {
      await Chat.create({
        participants: [userId, senderId],
        messages: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Friend request accepted",
      friends: user.friends.map((friend) => ({
        userId: friend.userId.toString(),
        name: friend.name || "Unknown",
      })),
    });
  } catch (error) {
    console.error("Error in /acceptfriend:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// Reject a friend request
router.post("/rejectfriend", auth, async (req, res) => {
  const { senderId, userId } = req.body;
  try {
    if (!senderId || !userId) {
      return res.status(400).json({ success: false, message: "senderId and userId are required" });
    }
    if (!mongoose.isValidObjectId(senderId) || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "Invalid senderId or userId format" });
    }
    const user = await CommunityUser.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.friendRequests = user.friendRequests || [];
    if (!user.friendRequests.some((req) => req.userId.toString() === senderId)) {
      return res.status(400).json({ success: false, message: "No friend request from this user" });
    }
    user.friendRequests = user.friendRequests.filter((req) => req.userId.toString() !== senderId);
    await user.save();
    res.status(200).json({
      success: true,
      message: "Friend request rejected",
      friendRequests: user.friendRequests.map((req) => ({
        userId: req.userId.toString(),
        name: req.name || "Unknown",
      })),
    });
  } catch (error) {
    console.error("Error in /rejectfriend:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// Fetch user's chats and friend requests
router.get("/getchats/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "Invalid User ID format" });
    }
    const user = await CommunityUser.findById(userId)
      .select("friendRequests friends")
      .populate("friendRequests.userId", "name")
      .populate("friends.userId", "name profile");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.friendRequests = user.friendRequests || [];
    user.friends = user.friends || [];
    const chats = await Chat.find({
      participants: userId,
    }).populate("participants", "name");
    res.status(200).json({
      success: true,
      friendRequests: user.friendRequests.map((req) => ({
        userId: req.userId?._id.toString(),
        name: req.userId?.name || req.name || "Unknown",
      })),
      friends: user.friends.map((friend) => ({
        userId: friend.userId?._id.toString(),
        name: friend.userId?.name || friend.name || "Unknown",
        profile: friend.profile || "",
      })),
      chats: chats.map((chat) => ({
        chatId: chat._id.toString(),
        friendId: chat.participants.find((p) => p._id.toString() !== userId)._id.toString(),
        friendName: chat.participants.find((p) => p._id.toString() !== userId).name || "Unknown",
        messages: chat.messages.map((msg) => ({
          senderId: msg.senderId.toString(),
          senderName: chat.participants.find((p) => p._id.toString() === msg.senderId.toString())?.name || "Unknown",
          text: msg.text,
          createdAt: msg.createdAt,
        })),
      })),
    });
  } catch (error) {
    console.error("Error in /getchats/:userId:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// Send a message
router.post("/sendmessage", auth, async (req, res) => {
  const { senderId, recipientId, text } = req.body;
  try {
    if (!senderId || !recipientId || !text) {
      return res.status(400).json({ success: false, message: "senderId, recipientId, and text are required" });
    }
    if (!mongoose.isValidObjectId(senderId) || !mongoose.isValidObjectId(recipientId)) {
      return res.status(400).json({ success: false, message: "Invalid senderId or recipientId format" });
    }
    const sender = await CommunityUser.findById(senderId).select("name friends");
    if (!sender) {
      return res.status(404).json({ success: false, message: "Sender not found" });
    }
    const recipient = await CommunityUser.findById(recipientId).select("name");
    if (!recipient) {
      return res.status(404).json({ success: false, message: "Recipient not found" });
    }
    if (!sender.friends.some((friend) => friend.userId.toString() === recipientId)) {
      return res.status(403).json({ success: false, message: "You can only message friends" });
    }
    let chat = await Chat.findOne({
      participants: { $all: [senderId, recipientId] },
    });
    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, recipientId],
        messages: [],
      });
    }
    chat.messages.push({ senderId, text });
    await chat.save();
    const updatedChat = await Chat.findById(chat._id).populate("participants", "name");
    res.status(200).json({
      success: true,
      chatId: chat._id.toString(),
      friendId: recipientId,
      friendName: recipient.name,
      messages: chat.messages.map((msg) => ({
        senderId: msg.senderId.toString(),
        senderName: updatedChat.participants.find((p) => p._id.toString() === msg.senderId.toString())?.name || "Unknown",
        text: msg.text,
        createdAt: msg.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error in /sendmessage:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// SSE for real-time messages
router.get("/messages/stream/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "Invalid User ID format" });
    }
    const user = await CommunityUser.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.write("data: {}\n\n"); // Initial heartbeat

    const interval = setInterval(async () => {
      try {
        const chats = await Chat.find({
          participants: userId,
          "messages.createdAt": { $gt: new Date(Date.now() - 5 * 1000) },
        }).populate("participants", "name");
        if (chats.length > 0) {
          const newMessages = chats.map((chat) => ({
            chatId: chat._id.toString(),
            friendId: chat.participants.find((p) => p._id.toString() !== userId)._id.toString(),
            friendName: chat.participants.find((p) => p._id.toString() !== userId).name || "Unknown",
            messages: chat.messages
              .filter((msg) => msg.createdAt > new Date(Date.now() - 5 * 1000))
              .map((msg) => ({
                senderId: msg.senderId.toString(),
                senderName: chat.participants.find((p) => p._id.toString() === msg.senderId.toString())?.name || "Unknown",
                text: msg.text,
                createdAt: msg.createdAt,
              })),
          }));
          if (newMessages.length > 0) {
            res.write(`data: ${JSON.stringify(newMessages)}\n\n`);
          }
        }
      } catch (error) {
        console.error("SSE error:", error);
      }
    }, 5000);

    req.on("close", () => {
      clearInterval(interval);
      res.end();
    });
  } catch (error) {
    console.error("Error in /messages/stream/:userId:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

module.exports = router;