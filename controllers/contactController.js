import WaitList from "../models/contact.js";
import { sendWaitlistEmail } from "../utils/email.js";


export const waitList = async (req, res) => {
  try {
    const { fullName, email, role, phone, location } = req.body;

    console.log(role);
    

    const formattedRole = role.toLowerCase();

    const existingContact = await WaitList.findOne({ email });
    if (existingContact) {
      return res
        .status(400)
        .json({ message: "You are already on the waiting list" });
    }

    const newWaitlistUser = new WaitList({
      fullName,
      email,
      role: formattedRole,
      phone,
      location,
    });

    await newWaitlistUser.save();

    // Send confirmation email
    await sendWaitlistEmail(email, fullName, role);

    res.status(201).json({
      message: "Registered successfully",
      userId: newWaitlistUser._id,
      email: newWaitlistUser.email,
    });
  } catch (error) {
    console.error("Waitlist error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getWaitlist = async (req, res) => {
  try {
    const waitlist = await WaitList.find().sort({ createdAt: -1 });
    res.status(200).json(waitlist);
  } catch (error) {
    console.error("Get waitlist error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};