//utils/nodeMailer.js
import 'dotenv/config.js';
import nodemailer from 'nodemailer';




const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


  // Verify SMTP configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP configuration error:');
    console.error(error);
  } else {
    console.log("SMTP configuration is correct. Server is ready to take our messages.");
  }
});

export const sendVerificationCode = async (to, code) => {
  const mailOptions = {
    from: '"MobileRuns" <no-reply@mobileruns.com>',
    to,
    subject: 'MobileRuns Verification Code',
    text: `Dear MobileRuns User,\n\nYour verification code is: ${code}\n\nThank you for choosing MobileRuns.\n\nBest regards,\nMobileRuns Team`,
  };

  return transporter.sendMail(mailOptions);
};




export const sendForgetEmailOtp = async (to, otp) => {
  const mailOptions = {
    from: '"MobileRuns" <no-reply@mobileruns.com>', 
    to,
    subject: 'Password Reset OTP',
    text: `You have requested a password reset. Use the following OTP to reset your password: ${otp}`,
    html: `<p>You have requested a password reset. Use the following OTP to reset your password:</p>
           <h3>${otp}</h3>`, // Display the OTP in a prominent way
  };

  return transporter.sendMail(mailOptions);
};



export const sendNotificationEmail = async (to, subject, message) => {
  const mailOptions = {
    from: '"MobileRuns" <no-reply@mobileruns.com>',
    to,
    subject,
    text: message,
    html: `<p>${message}</p>`,
  };

  return transporter.sendMail(mailOptions);
};


export const sendWaitlistEmail = async (email, fullName, role) => {
    const mailOptions = {
      from: `"MobileRuns" <${process.env.WAITLIST_EMAIL_USER}>`,
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