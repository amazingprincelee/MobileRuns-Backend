import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Log environment variables for debugging (remove in production)
console.log("SMTP Host:", process.env.NODE_MAIL_HOST);
console.log("Email User:", process.env.EMAIL_USER);



const transporter = nodemailer.createTransport({
  host: process.env.NODE_MAIL_HOST, 
  port: 465,
  secure: true, // Use SSL for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWaitlistEmail = async (email, fullName, role) => {
  const mailOptions = {
    from: `"MobileRuns" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Our Waitlist!",
    html: `
      <h1>Hello, ${fullName}!</h1>
      <p>Thank you for joining our waitlist as a ${role}.</p>
      <p>You'll be the first to know when we launch. Stay tuned for updates!</p>
      <p>Best regards,<br/>The Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};