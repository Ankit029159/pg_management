# 🔐 PhonePe Payment Gateway Debugging Guide

## Overview
This guide will help you debug the "Invalid request parameters" error in your PhonePe payment gateway integration. The issue is likely in the payload format, checksum generation, or API endpoint configuration.

## 🚀 Quick Start

### 1. Test Your Backend Configuration
First, test if your backend can connect to PhonePe:

```bash
cd backend
node test_phonepe_debug_enhanced.js
```

This script will:
- ✅ Validate your PhonePe configuration
- 📤 Test payload construction
- 🔐 Generate and verify checksums
- 🚀 Make a test API call to PhonePe
- 📊 Provide detailed error analysis

### 2. Test Frontend Integration
Open `test_simple_payment.html` in your browser to test the complete payment flow.

## 🔍 Enhanced Logging Added

Your `simplePaymentController.js` now includes comprehensive logging:

### Frontend Request Logging
```javascript
console.log('🔍 Received payment initiation request from frontend:', req.body);
```

### Configuration Validation
```javascript
validatePhonePeConfig(); // Validates all required fields
```

### Payload Construction Logging
```javascript
console.log('📤 PhonePe Payload Constructed:', JSON.stringify(payload, null, 2));
console.log('🔑 PhonePe Configuration:', { MERCHANT_ID, BASE_URL, SALT_INDEX, CALLBACK_URL });
```

### Checksum Generation Logging
```javascript
console.log('🔐 Generating checksum for payload...');
console.log('📝 Payload JSON string length:', payloadString.length);
console.log('📦 Base64 encoded payload length:', base64.length);
console.log('🔗 String to hash length:', string.length);
console.log('🔑 Salt key length:', PHONEPE_CONFIG.SALT_KEY.length);
console.log('🔒 SHA256 hash generated, length:', sha256.length);
console.log('✅ Final checksum generated:', checksum);
```

### API Call Logging
```javascript
console.log('🚀 Making request to PhonePe API:', `${PHONEPE_CONFIG.BASE_URL}/pg/v1/pay`);
```

### Response Logging
```javascript
console.log('✅ PhonePe API Response Received:', {
  status: phonepeResponse.status,
  statusText: phonepeResponse.statusText,
  data: phonepeResponse.data
});
```

### Enhanced Error Handling
```javascript
// Detailed PhonePe API error logging
console.error('📡 PhonePe API Error Response:', {
  status: error.response.status,
  statusText: error.response.statusText,
  headers: error.response.headers,
  data: error.response.data
});

// Specific error message extraction
const errorMessage = error.response.data?.message || 
                    error.response.data?.error || 
                    error.response.data?.description ||
                    'Unknown PhonePe API error';

console.error('🚨 PhonePe Error Message:', errorMessage);
```

## 🧪 Testing Steps

### Step 1: Backend Configuration Test
```bash
node test_phonepe_debug_enhanced.js
```

**Expected Output:**
```
🚀 Starting Enhanced PhonePe Integration Test...

🔍 Validating PhonePe Configuration...
  MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID
  SALT_KEY: process.env.PHONEPE_SALT_KEY
  SALT_INDEX: 1
  BASE_URL: https://api-uat.phonepe.com/apis/hermes
  CALLBACK_URL: process.env.PHONEPE_CALLBACK_URL

📤 Test Payload: {...}

🔐 Generating Checksum...
  Payload JSON string length: 234
  Base64 encoded payload length: 312
  String to hash length: 356
  Salt key length: 36
  SHA256 hash length: 64
  Final checksum: abc123...###1

🚀 Testing PhonePe API Call...
  URL: https://api-uat.phonepe.com/apis/hermes/pg/v1/pay
  Headers: {...}

✅ PhonePe API Test Successful!
  Status: 200
  Response: {...}
```

### Step 2: Frontend Integration Test
1. Open `test_simple_payment.html` in your browser
2. Fill in the form (pre-filled with test data)
3. Click "🧪 Test Configuration" to verify backend connectivity
4. Click "🚀 Initiate Payment" to test the complete flow

## 🚨 Common Error Patterns & Solutions

### 400 Bad Request
**Symptoms:** `Invalid request parameters`
**Causes:**
- Missing required fields in payload
- Incorrect amount format (should be in paise)
- Invalid merchantId
- Checksum mismatch

**Debug Steps:**
1. Check the "PhonePe Payload Constructed" log
2. Verify amount is in paise (₹1 = 100 paise)
3. Ensure all required fields are present
4. Verify checksum generation logs

### 401 Unauthorized
**Symptoms:** `Unauthorized` or `Invalid credentials`
**Causes:**
- Incorrect MERCHANT_ID or SALT_KEY
- Checksum generation error
- Using production credentials in UAT

**Debug Steps:**
1. Verify credentials in `config.env`
2. Check checksum generation logs
3. Ensure you're using UAT credentials

### 403 Forbidden
**Symptoms:** `Forbidden` or `Access denied`
**Causes:**
- Inactive PhonePe account
- IP whitelist restrictions
- Account suspended

**Debug Steps:**
1. Check PhonePe account status
2. Verify IP whitelist settings
3. Contact PhonePe support

### Network Errors
**Symptoms:** `ECONNABORTED`, `ENOTFOUND`, `ECONNREFUSED`
**Causes:**
- Network connectivity issues
- Firewall blocking requests
- PhonePe API endpoint down

**Debug Steps:**
1. Check internet connectivity
2. Verify firewall settings
3. Test with `ping` or `curl`

## 📋 Debugging Checklist

- [ ] Backend server running on port 5001
- [ ] PhonePe configuration loaded from `config.env`
- [ ] All required environment variables set
- [ ] Network connectivity to PhonePe UAT API
- [ ] Payload contains all required fields
- [ ] Amount converted to paise correctly
- [ ] Checksum generated properly
- [ ] API endpoint URL correct
- [ ] Headers include X-VERIFY and X-MERCHANT-ID

## 🔧 Troubleshooting Commands

### Test Network Connectivity
```bash
# Test if you can reach PhonePe UAT API
curl -I https://api-uat.phonepe.com/apis/hermes

# Test your backend endpoint
curl -X POST https://api.pg.gradezy.in/api/simple-payment/test
```

### Check Environment Variables
```bash
# In your backend directory
node -e "require('dotenv').config(); console.log('PHONEPE_CLIENT_ID:', process.env.PHONEPE_CLIENT_ID)"
```

### Monitor Backend Logs
```bash
# Watch backend logs in real-time
tail -f backend/logs/app.log  # if you have logging configured
```

## 📚 PhonePe API Documentation

- **UAT Environment:** https://api-uat.phonepe.com/apis/hermes
- **Production Environment:** https://api.phonepe.com/apis/hermes
- **Documentation:** Check PhonePe's official integration guide

## 🆘 Still Having Issues?

If you're still getting errors after following this guide:

1. **Check the enhanced logs** - Look for specific error messages
2. **Compare with PhonePe docs** - Ensure payload format matches exactly
3. **Test with minimal payload** - Remove optional fields temporarily
4. **Verify UAT credentials** - Ensure you're using test credentials
5. **Contact PhonePe support** - They can help with account-specific issues

## 🎯 Next Steps

1. Run the enhanced test script
2. Check the detailed logs in your backend console
3. Use the HTML test page to verify frontend integration
4. Compare your payload with PhonePe's expected format
5. Fix any configuration or payload issues identified

The enhanced logging should now give you much more specific information about what's causing the "Invalid request parameters" error!
