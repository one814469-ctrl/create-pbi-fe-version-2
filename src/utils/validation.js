// src/utils/validation.js

/**
 * Validates an email address format.
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

/**
 * Validates a 10-digit phone number format.
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhoneNumber = (phone) => {
  return /^\d{10}$/.test(phone);
};

/**
 * Validates if a value is a positive number.
 * @param {string|number} value
 * @returns {boolean}
 */
export const isPositiveNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

/**
 * Validates if a loan amount is within a specified range for a given loan type.
 * @param {number} amount
 * @param {'personal'|'home'} loanType
 * @returns {boolean}
 */
export const isValidLoanAmount = (amount, loanType) => {
  const minAmount = 1000;
  const maxPersonalAmount = 50000;
  const maxHomeAmount = 500000; // Mock upper limit for home loans

  if (loanType === 'personal') {
    return amount >= minAmount && amount <= maxPersonalAmount;
  } else if (loanType === 'home') {
    return amount >= minAmount && amount <= maxHomeAmount;
  }
  return false;
};

/**
 * Generic required field validator.
 * @param {string} value
 * @returns {boolean}
 */
export const isRequired = (value) => {
  return value !== null && value.trim() !== '';
};

// You can extend this with more specific validation rules as needed