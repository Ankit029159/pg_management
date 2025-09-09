# 📧 Contact Form Setup Guide

This guide explains how the contact form integration works and how to test it.

## 🔧 What Was Set Up

### 1. Backend Components
- **Contact Model** (`backend/models/contactModel.js`) - Database schema for contact messages
- **Contact Controller** (`backend/controllers/contactController.js`) - Handles all contact operations
- **Contact Routes** (`backend/routes/contactRoutes.js`) - API endpoints for contact functionality
- **Main Integration** - Added contact routes to `backend/index.js`

### 2. Frontend Components
- **Contact Form** (`frontend/src/pages/Contact.jsx`) - User-facing contact form
- **Admin Panel** (`frontend/src/admin/ContactManagement.jsx`) - Admin interface to manage messages

## 🌐 API Endpoints

### Public Endpoints (No Authentication Required)
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Authentication Required)
- `GET /api/contact` - Get all contact messages
- `GET /api/contact/stats` - Get contact statistics
- `GET /api/contact/:id` - Get single contact message
- `PUT /api/contact/:id` - Update contact message status
- `DELETE /api/contact/:id` - Delete contact message

## 🚀 How to Test

### Step 1: Start Your Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 2: Test the Contact Form
1. **Visit**: http://localhost:5173/contact
2. **Fill out the form** with test data:
   - Name: John Doe
   - Email: john@example.com
   - Phone: 9876543210
   - Subject: Test Message
   - Message: This is a test message
3. **Click "Send Message"**
4. **Verify success message** appears

### Step 3: Check Admin Panel
1. **Login to admin panel**: http://localhost:5173/adminlogin
2. **Navigate to**: Contact Management
3. **Verify the message appears** in the list
4. **Test admin functions**:
   - View message details
   - Update status (new → read → replied → closed)
   - Add admin notes
   - Delete message

### Step 4: Run Automated Test
```bash
# Run the test script
node test_contact_form.js
```

## 📊 Contact Message Status Flow

```
new → read → replied → closed
```

- **new**: Just received (default)
- **read**: Admin has viewed the message
- **replied**: Admin has responded to the user
- **closed**: Issue resolved, no further action needed

## 🔍 Database Schema

```javascript
{
  name: String (required),
  email: String (required, validated),
  phone: String (optional),
  subject: String (required),
  message: String (required),
  type: String (enum: 'contact', 'enquiry'),
  status: String (enum: 'new', 'read', 'replied', 'closed'),
  adminNotes: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## 🛡️ Security Features

### Form Validation
- **Name**: 2-100 characters
- **Email**: Valid email format
- **Phone**: 10-15 characters (optional)
- **Subject**: 5-200 characters
- **Message**: 10-1000 characters

### Admin Protection
- All admin endpoints require JWT authentication
- Contact form submission is public (no auth required)
- Admin can manage all contact messages

## 📱 User Experience

### Contact Form Features
- ✅ **Real-time validation**
- ✅ **Success/error messages**
- ✅ **Form reset after submission**
- ✅ **Responsive design**
- ✅ **Loading states**

### Admin Panel Features
- ✅ **Message listing with pagination**
- ✅ **Status management**
- ✅ **Search and filtering**
- ✅ **Statistics dashboard**
- ✅ **Message details modal**
- ✅ **Admin notes functionality**

## 🐛 Troubleshooting

### Common Issues

#### Contact Form Not Submitting
```bash
# Check backend is running
curl http://localhost:5001/api/test

# Check contact endpoint
curl -X POST http://localhost:5001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test message"}'
```

#### Admin Panel Not Loading Messages
1. **Check authentication**: Make sure you're logged in
2. **Check network tab**: Look for API errors
3. **Check backend logs**: Look for error messages

#### Database Connection Issues
```bash
# Check MongoDB connection in backend logs
# Should see: "✅ Connected to MongoDB"
```

## 📈 Monitoring

### Contact Statistics
The admin panel shows:
- **Total Messages**: All contact submissions
- **New Messages**: Unread messages
- **Read Messages**: Viewed by admin
- **Replied Messages**: Admin has responded
- **Closed Messages**: Resolved issues

### Performance
- **Pagination**: 10 messages per page by default
- **Indexing**: Database indexes on status and createdAt
- **Caching**: Consider adding Redis for high traffic

## 🔄 Production Deployment

### Environment Variables
```env
# Backend
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri

# Frontend
VITE_API_URL=https://api.pg.gradezy.in/api
```

### Security Considerations
- **Rate Limiting**: Add rate limiting to contact endpoint
- **Input Sanitization**: Already implemented with express-validator
- **CORS**: Configured for production domain
- **HTTPS**: Ensure all communication is encrypted

## 📞 Support

If you encounter issues:
1. **Check console logs** in browser and backend
2. **Verify API endpoints** are accessible
3. **Test with the provided test script**
4. **Check database connection**

---

**Contact form is now fully integrated and ready for use! 🎉**
