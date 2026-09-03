// OTP Management utilities

const otpStore = new Map(); // Store OTPs temporarily in memory

const generateOTP = (length = 6) => {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0');
};

const storeOTP = (email, otp, expiryMinutes = 5) => {
  const expiryTime = Date.now() + expiryMinutes * 60 * 1000;
  otpStore.set(email.toLowerCase(), {
    otp,
    expiryTime,
    attempts: 0,
  });
};

const verifyOTP = (email, otp) => {
  const otpData = otpStore.get(email.toLowerCase());

  if (!otpData) {
    return { valid: false, message: 'OTP not found or expired' };
  }

  if (Date.now() > otpData.expiryTime) {
    otpStore.delete(email.toLowerCase());
    return { valid: false, message: 'OTP expired' };
  }

  if (otpData.attempts >= 3) {
    otpStore.delete(email.toLowerCase());
    return { valid: false, message: 'Max OTP attempts exceeded' };
  }

  if (otpData.otp !== otp) {
    otpData.attempts += 1;
    return { valid: false, message: 'Invalid OTP' };
  }

  // OTP is valid, remove it
  otpStore.delete(email.toLowerCase());
  return { valid: true, message: 'OTP verified successfully' };
};

const clearOTP = (email) => {
  otpStore.delete(email.toLowerCase());
};

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  clearOTP,
};
