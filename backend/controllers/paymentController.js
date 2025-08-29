const crypto = require('crypto');
const axios = require('axios');
const Booking = require('../models/bookingModel');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// PhonePe Configuration
const PHONEPE_CONFIG = {
  MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID || 'M232T7DTC1W58',
  SALT_KEY: process.env.PHONEPE_SALT_KEY || '006c20b2-0a39-423a-9cd3-8e359879dd15',
  SALT_INDEX: process.env.PHONEPE_SALT_INDEX || '1',
  BASE_URL: process.env.PHONEPE_BASE_URL || 'https://api.phonepe.com/apis/hermes',
  CALLBACK_URL: process.env.CALLBACK_URL || 'https://api.pg.gradezy.in/api/payment/callback',
  WEBHOOK_URL: process.env.WEBHOOK_URL || 'https://api.pg.gradezy.in/api/payment/webhook'
};

// Generate PhonePe checksum
const generateChecksum = (payload) => {
  const base64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  const string = base64 + '/pg/v1/pay' + PHONEPE_CONFIG.SALT_KEY;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  const checksum = sha256 + '###' + PHONEPE_CONFIG.SALT_INDEX;
  return checksum;
};

// @desc    Create PhonePe payment
// @route   POST /api/payment/create
// @access  Public
const createPayment = async (req, res) => {
  try {
    const { bookingId, amount, userMobile, userEmail, userName } = req.body;

    // Validate booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Generate unique transaction ID
    const transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Prepare PhonePe payload
    const payload = {
      merchantId: PHONEPE_CONFIG.MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: booking.userId,
      amount: amount * 100, // Convert to paise
      redirectUrl: `${req.protocol}://${req.get('host')}/payment-success?bookingId=${bookingId}`,
      redirectMode: 'POST',
      callbackUrl: PHONEPE_CONFIG.CALLBACK_URL,
      mobileNumber: userMobile,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    // Generate checksum
    const checksum = generateChecksum(payload);
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');

    // Make request to PhonePe
    const phonepeResponse = await axios.post(
      `${PHONEPE_CONFIG.BASE_URL}/pg/v1/pay`,
      {
        request: base64Payload
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
        }
      }
    );

    // Update booking with transaction details
    booking.transactionId = transactionId;
    booking.paymentStatus = 'Pending';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Payment initiated successfully',
      data: {
        redirectUrl: phonepeResponse.data.data.instrumentResponse.redirectInfo.url,
        transactionId: transactionId,
        bookingId: bookingId
      }
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment',
      error: error.message
    });
  }
};

// @desc    Payment callback
// @route   POST /api/payment/callback
// @access  Public
const paymentCallback = async (req, res) => {
  try {
    const { merchantTransactionId, transactionId, amount, status, paymentInstrument } = req.body;

    // Find booking by transaction ID
    const booking = await Booking.findOne({ transactionId: merchantTransactionId });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update booking status
    if (status === 'PAYMENT_SUCCESS') {
      booking.paymentStatus = 'Paid';
      booking.status = 'Active';
      booking.paymentDetails = {
        phonepeTransactionId: transactionId,
        amount: amount / 100, // Convert from paise
        paymentMethod: paymentInstrument?.type || 'PhonePe',
        paidAt: new Date()
      };
    } else {
      booking.paymentStatus = 'Failed';
      booking.status = 'Cancelled';
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Payment callback processed successfully'
    });

  } catch (error) {
    console.error('Payment callback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment callback',
      error: error.message
    });
  }
};

// @desc    Generate PDF receipt
// @route   GET /api/payment/receipt/:bookingId
// @access  Public
const generateReceipt = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate('roomId')
      .populate('buildingId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Create PDF
    const doc = new PDFDocument();
    const filename = `receipt_${booking.bookingId}_${Date.now()}.pdf`;
    const filepath = path.join(__dirname, '../uploads/receipts', filename);

    // Ensure receipts directory exists
    const receiptsDir = path.dirname(filepath);
    if (!fs.existsSync(receiptsDir)) {
      fs.mkdirSync(receiptsDir, { recursive: true });
    }

    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    // PDF Content
    doc.fontSize(24).text('PG Booking Receipt', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Receipt No: ${booking.bookingId}`);
    doc.text(`Date: ${new Date(booking.createdAt).toLocaleDateString()}`);
    doc.text(`Time: ${new Date(booking.createdAt).toLocaleTimeString()}`);
    doc.moveDown();

    doc.fontSize(16).text('Customer Details', { underline: true });
    doc.fontSize(12).text(`Name: ${booking.userName}`);
    doc.text(`Mobile: ${booking.userMobile || 'N/A'}`);
    doc.text(`Email: ${booking.userEmail || 'N/A'}`);
    doc.moveDown();

    doc.fontSize(16).text('Booking Details', { underline: true });
    doc.fontSize(12).text(`Building: ${booking.buildingName}`);
    doc.text(`Room: ${booking.roomId?.roomId || 'N/A'}`);
    doc.text(`Bed: ${booking.bedId}`);
    doc.text(`Check-in: ${new Date(booking.checkInDate).toLocaleDateString()}`);
    doc.text(`Check-out: ${new Date(booking.checkOutDate).toLocaleDateString()}`);
    doc.moveDown();

    doc.fontSize(16).text('Payment Details', { underline: true });
    doc.fontSize(12).text(`Amount: ₹${booking.amount}`);
    doc.text(`Payment Status: ${booking.paymentStatus}`);
    doc.text(`Booking Status: ${booking.status}`);
    
    if (booking.paymentDetails) {
      doc.text(`Transaction ID: ${booking.paymentDetails.phonepeTransactionId || 'N/A'}`);
      doc.text(`Payment Method: ${booking.paymentDetails.paymentMethod || 'N/A'}`);
      if (booking.paymentDetails.paidAt) {
        doc.text(`Paid At: ${new Date(booking.paymentDetails.paidAt).toLocaleString()}`);
      }
    }
    doc.moveDown();

    doc.fontSize(10).text('Thank you for choosing our PG!', { align: 'center' });
    doc.text('For any queries, please contact us.', { align: 'center' });

    doc.end();

    stream.on('finish', () => {
      res.download(filepath, filename, (err) => {
        if (err) {
          console.error('Download error:', err);
        }
        // Clean up file after download
        fs.unlink(filepath, (unlinkErr) => {
          if (unlinkErr) console.error('File cleanup error:', unlinkErr);
        });
      });
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating receipt',
      error: error.message
    });
  }
};

// @desc    Get payment status
// @route   GET /api/payment/status/:transactionId
// @access  Public
const getPaymentStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const booking = await Booking.findOne({ transactionId });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        bookingId: booking.bookingId,
        paymentStatus: booking.paymentStatus,
        bookingStatus: booking.status,
        amount: booking.amount,
        transactionId: booking.transactionId
      }
    });

  } catch (error) {
    console.error('Payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment status',
      error: error.message
    });
  }
};

module.exports = {
  createPayment,
  paymentCallback,
  generateReceipt,
  getPaymentStatus
};
