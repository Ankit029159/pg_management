# PhonePe Payment Gateway Integration - Test Setup

This document explains how to test the PhonePe payment gateway integration locally.

## Configuration

The system is configured to use PhonePe's test environment with the following credentials:

- **Merchant ID**: `TEST-M232T7DTC1W58_25082`
- **Salt Key**: `NTE2NWRjMzItYzA1NS00YjM0LTk5NmltMmZİYjA2YzU0OTcz`
- **Salt Index**: `1`
- **Base URL**: `https://api-preprod.phonepe.com/apis/pg-sandbox`

## Testing Steps

### 1. Start the Backend Server

```bash
cd backend
npm install
npm start
```

The backend will run on `https://api.pg.gradezy.in`

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3. Test PhonePe Configuration

Visit: `https://api.pg.gradezy.in/api/payment/test-config`

This will show you the current PhonePe configuration and test the checksum generation.

### 4. Test the Complete Flow

1. Go to `http://localhost:5173/bookingpg`
2. Select an available bed
3. Fill in your details
4. Click "Book Now & Pay"
5. You should be redirected to PhonePe's test payment page
6. Use test credentials to complete the payment
7. You'll be redirected back to the payment success page

## Test Payment Credentials

For PhonePe test environment, you can use:
- **Phone Number**: Any 10-digit number
- **OTP**: Any 6-digit number
- **Payment Method**: Any test card details

## Expected Flow

1. **User fills booking form** → Creates booking in database
2. **Payment initiation** → Calls PhonePe API with test credentials
3. **PhonePe redirect** → User sees PhonePe payment page
4. **Payment completion** → PhonePe redirects back to success page
5. **Status update** → Booking status updated in admin panel

## Troubleshooting

### Common Issues

1. **Configuration Error**: Check if environment variables are loaded correctly
2. **CORS Error**: Ensure backend CORS is configured for localhost:5173
3. **PhonePe API Error**: Verify test credentials and API endpoint
4. **Redirect Error**: Check if payment success route is properly configured

### Debug Endpoints

- **Configuration Test**: `GET /api/payment/test-config`
- **Payment Status**: `GET /api/payment/status/:transactionId`
- **Generate Receipt**: `GET /api/payment/receipt/:bookingId`

### Logs

Check backend console for detailed logs:
- PhonePe configuration details
- Request payloads
- API responses
- Error details

## Admin Panel

After successful payment, check the admin panel at `/admin/bookingdetails` to see:
- Booking details
- Payment status
- Transaction ID
- User information

## Next Steps

Once testing is successful:
1. Update configuration for production
2. Implement proper error handling
3. Add payment webhooks
4. Implement payment retry logic
5. Add payment analytics

## Support

If you encounter issues:
1. Check the backend logs
2. Verify PhonePe test credentials
3. Test individual API endpoints
4. Check network connectivity to PhonePe APIs
