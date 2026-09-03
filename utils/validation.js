// Validation helper functions

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return passwordRegex.test(password);
};

const validateContactNumber = (number) => {
  // Basic phone number validation (10 digits)
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(number?.replace(/\D/g, ''));
};

const validateOTP = (otp) => {
  // OTP should be 6 digits
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

const validateRequiredFields = (data, requiredFields) => {
  const missingFields = requiredFields.filter((field) => !data[field] || data[field].toString().trim() === '');
  return missingFields;
};

const validateJobData = (jobData) => {
  const requiredFields = ['title', 'location', 'qualification', 'experience', 'skills', 'salary'];
  const errors = [];

  // Check required fields
  const missingFields = validateRequiredFields(jobData, requiredFields);
  if (missingFields.length > 0) {
    errors.push(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Validate salary is a number
  // Salary and experience can be strings (e.g. "₹20,000 – ₹30,000" or "1–3 Years"); do not enforce numeric values.

  return errors;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateContactNumber,
  validateOTP,
  validateRequiredFields,
  validateJobData,
};
