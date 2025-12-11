const axios = require("axios");

const otpStore = {}; // temporary store

async function sendOTP(phone) {
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[phone] = otp;

  try {
    await axios.post("https://www.fast2sms.com/dev/bulkV2", {
      sender_id: "FSTSMS",
      message: "Your NCC verification OTP is {#var#}",
      variables_values: otp,
      route: "otp",
      numbers: phone
    }, {
      headers: {
        authorization: process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json"
      }
    });

    console.log(`✅ OTP sent to ${phone}: ${otp}`);
  } catch (err) {
    console.error("❌ Fast2SMS error:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = sendOTP;
module.exports.otpStore = otpStore;
