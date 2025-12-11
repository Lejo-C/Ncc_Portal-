const nodemailer = require("nodemailer");
const crypto = require("crypto");

const tokenStore = {}; // temporary store

async function sendVerificationEmail(email) {
  const token = crypto.randomBytes(32).toString("hex");
  tokenStore[token] = email;

  const link = `http://localhost:5173/verify-email/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your NCC email",
      html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`
    });

    console.log(`✅ Verification email sent to ${email}`);
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    throw err;
  }
}

module.exports = sendVerificationEmail;
module.exports.tokenStore = tokenStore;
