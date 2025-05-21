import Chat from "../models/chat.js";

// Get chat history for a specific job
export const getChatHistory = async (req, res) => {
  try {
    const { jobId } = req.params;
    const chats = await Chat.find({ jobId })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: 1 });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Save a new chat message
export const saveMessage = async (messageData) => {
  try {
    const newMessage = new Chat(messageData);
    await newMessage.save();
    return await newMessage.populate(["sender", "receiver"]);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const { jobId, userId } = req.params;
    await Chat.updateMany(
      { jobId, receiver: userId, read: false },
      { read: true }
    );
    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};