// Simple PhonePe Configuration for Testing
const PHONEPE_CONFIG = {
  MERCHANT_ID: process.env.PHONEPE_CLIENT_ID,
  SALT_KEY: process.env.PHONEPE_CLIENT_SECRET,
  SALT_INDEX: process.env.PHONEPE_CLIENT_VERSION,
  BASE_URL: process.env.PHONEPE_BASE_URL,
  CALLBACK_URL: process.env.CALLBACK_URL,
  WEBHOOK_URL: process.env.WEBHOOK_URL
};

module.exports = PHONEPE_CONFIG;
