import User from "../models/users.js";
import bcrypt from 'bcrypt';
const saltRound = 10;



export const updatePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.params.userId; 

      console.log(userId);
      
  
      // Find user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
  
      // Hash new password
      const hash = await bcrypt.hash(newPassword, saltRound);
  
      // Update user's password
      user.password = hash;
      await user.save();
  
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  };