import Notification from "../models/Notification.js";


export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 }) 
      .populate("senderId", "username profilePicture") 
      .populate("postId", "desc");

    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.status(200).json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const markAllRead = async (req, res) => {
    try {
      await Notification.updateMany({ userId: req.user.id }, { isRead: true });
      res.status(200).json({ message: "All marked as read" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };