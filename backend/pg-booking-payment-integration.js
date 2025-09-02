// PG Booking Payment Integration with PhonePe
// This file integrates with your existing PG booking system

// Function to initiate PG booking payment
async function initiatePGBookingPayment(bookingData) {
    try {
        console.log('🚀 Initiating PG Booking Payment...');
        console.log('📝 Booking Data:', bookingData);
        
        // Prepare payment request data
        const paymentRequest = {
            bookingId: bookingData.bookingId,
            userId: bookingData.userEmail, // Using email as userId
            userName: `${bookingData.firstName} ${bookingData.lastName}`,
            userMobile: bookingData.phone,
            userEmail: bookingData.userEmail,
            userWhatsapp: bookingData.whatsapp || bookingData.phone,
            bedId: bookingData.selectedBed,
            buildingName: bookingData.selectedPG,
            amount: parseFloat(bookingData.rentAmount),
            checkInDate: bookingData.checkInDate,
            checkOutDate: bookingData.checkOutDate,
            pgDetails: {
                pgName: bookingData.selectedPG,
                floor: bookingData.selectedFloor,
                room: bookingData.selectedRoom,
                bedId: bookingData.selectedBed,
                buildingName: bookingData.selectedPG
            }
        };

        console.log('💰 Payment Request Prepared:', paymentRequest);

        // Make API call to initiate payment
        const response = await fetch('https://api.pg.gradezy.in/api/pg-payment/initiate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentRequest)
        });
        
        const responseData = await response.json();
        console.log('📡 Payment Initiation Response:', responseData);
        
        if (!response.ok) { 
            throw new Error(responseData.message || 'Failed to initiate payment'); 
        }
        
        console.log('✅ Payment initiated successfully!');
        console.log('🔗 Redirect URL:', responseData.data.redirectUrl);
        
        return responseData;
        
    } catch (error) {
        console.error('❌ Payment initiation failed:', error);
        throw error;
    }
}

// Function to handle PG booking form submission
async function handlePGBookingSubmission(formData) {
    try {
        console.log('📋 Processing PG Booking Form...');
        
        // Validate form data
        if (!formData.firstName || !formData.lastName || !formData.userEmail || 
            !formData.phone || !formData.selectedBed || !formData.selectedPG || 
            !formData.rentAmount || !formData.checkInDate || !formData.checkOutDate) {
            throw new Error('Please fill in all required fields');
        }

        // Generate unique booking ID
        const bookingId = 'BK_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Add booking ID to form data
        const bookingData = {
            ...formData,
            bookingId: bookingId
        };

        console.log('📝 Booking Data Validated:', bookingData);

        // First, save the booking to your database (you'll need to implement this)
        // const savedBooking = await savePGBooking(bookingData);
        
        // For now, we'll proceed with payment initiation
        console.log('💳 Proceeding to payment...');
        
        // Initiate payment
        const paymentResult = await initiatePGBookingPayment(bookingData);
        
        // Redirect to PhonePe payment page
        if (paymentResult.data.redirectUrl) {
            console.log('🔄 Redirecting to PhonePe payment page...');
            
            // Store booking data in sessionStorage for later use
            sessionStorage.setItem('pgBookingData', JSON.stringify(bookingData));
            sessionStorage.setItem('paymentTransactionId', paymentResult.data.transactionId);
            
            // Redirect to PhonePe
            window.location.href = paymentResult.data.redirectUrl;
        } else {
            throw new Error('No redirect URL received from payment gateway');
        }
        
    } catch (error) {
        console.error('💥 PG Booking failed:', error);
        // Show error to user
        showErrorMessage(error.message);
    }
}

// Function to handle payment success callback
async function handlePaymentSuccess(bookingId, transactionId) {
    try {
        console.log('🎉 Payment successful! Processing booking confirmation...');
        
        // Get stored booking data
        const bookingData = JSON.parse(sessionStorage.getItem('pgBookingData') || '{}');
        const storedTransactionId = sessionStorage.getItem('paymentTransactionId');
        
        if (!bookingData.bookingId || storedTransactionId !== transactionId) {
            throw new Error('Invalid payment confirmation data');
        }

        // Update booking status in your database
        // await updatePGBookingStatus(bookingId, 'Confirmed', transactionId);
        
        // Clear stored data
        sessionStorage.removeItem('pgBookingData');
        sessionStorage.removeItem('paymentTransactionId');
        
        // Show success message
        showSuccessMessage('Payment successful! Your PG booking has been confirmed.');
        
        // Redirect to booking confirmation page
        setTimeout(() => {
            window.location.href = `/booking-confirmation?bookingId=${bookingId}`;
        }, 3000);
        
    } catch (error) {
        console.error('❌ Error processing payment success:', error);
        showErrorMessage('Payment successful but error processing confirmation. Please contact support.');
    }
}

// Function to check payment status
async function checkPaymentStatus(transactionId) {
    try {
        console.log('🔍 Checking payment status for transaction:', transactionId);
        
        const response = await fetch(`https://api.pg.gradezy.in/api/pg-payment/details/${transactionId}`);
        const data = await response.json();
        
        if (response.ok) {
            console.log('📊 Payment Status:', data.data.paymentStatus);
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to check payment status');
        }
        
    } catch (error) {
        console.error('❌ Error checking payment status:', error);
        throw error;
    }
}

// Function to get payment history
async function getPaymentHistory(userId = null, status = null) {
    try {
        console.log('📚 Fetching payment history...');
        
        let url = 'https://api.pg.gradezy.in/api/pg-payment/history';
        const params = new URLSearchParams();
        
        if (userId) params.append('userId', userId);
        if (status) params.append('status', status);
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok) {
            console.log('📊 Payment History Retrieved:', data.data);
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to fetch payment history');
        }
        
    } catch (error) {
        console.error('❌ Error fetching payment history:', error);
        throw error;
    }
}

// Utility functions for UI
function showSuccessMessage(message) {
    // Implement your success message display
    console.log('✅ Success:', message);
    // Example: showToast(message, 'success');
}

function showErrorMessage(message) {
    // Implement your error message display
    console.log('❌ Error:', message);
    // Example: showToast(message, 'error');
}

function showLoadingMessage(message = 'Processing...') {
    // Implement your loading message display
    console.log('⏳ Loading:', message);
    // Example: showSpinner(message);
}

function hideLoadingMessage() {
    // Implement your loading message hide
    console.log('✅ Loading complete');
    // Example: hideSpinner();
}

// Example integration with your existing PG booking form
function integrateWithPGBookingForm() {
    // This function shows how to integrate with your existing form
    
    // Example: Add event listener to your "Book Now & Pay" button
    const bookNowButton = document.querySelector('#bookNowButton');
    if (bookNowButton) {
        bookNowButton.addEventListener('click', async (e) => {
            e.preventDefault();
            
            try {
                showLoadingMessage('Initiating payment...');
                
                // Get form data from your existing form
                const formData = {
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    userEmail: document.getElementById('userEmail').value,
                    phone: document.getElementById('userMobile').value,
                    whatsapp: document.getElementById('userWhatsapp').value,
                    selectedBed: document.getElementById('selectedBed').value,
                    selectedPG: document.getElementById('selectedPG').value,
                    selectedFloor: document.getElementById('selectedFloor').value,
                    selectedRoom: document.getElementById('selectedRoom').value,
                    rentAmount: document.getElementById('rentAmount').value,
                    checkInDate: document.getElementById('checkInDate').value,
                    checkOutDate: document.getElementById('checkOutDate').value
                };
                
                // Process the booking
                await handlePGBookingSubmission(formData);
                
            } catch (error) {
                showErrorMessage(error.message);
            } finally {
                hideLoadingMessage();
            }
        });
    }
}

// Payment success page handler
function handlePaymentSuccessPage() {
    // This function should be called on your payment success page
    
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('bookingId');
    const transactionId = urlParams.get('transactionId');
    
    if (bookingId && transactionId) {
        console.log('🎉 Payment success page loaded');
        console.log('📋 Booking ID:', bookingId);
        console.log('💳 Transaction ID:', transactionId);
        
        // Process the successful payment
        handlePaymentSuccess(bookingId, transactionId);
    } else {
        console.error('❌ Missing payment confirmation parameters');
        showErrorMessage('Invalid payment confirmation data');
    }
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initiatePGBookingPayment,
        handlePGBookingSubmission,
        handlePaymentSuccess,
        checkPaymentStatus,
        getPaymentHistory,
        integrateWithPGBookingForm,
        handlePaymentSuccessPage
    };
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
    console.log('🚀 PG Booking Payment Integration Loaded');
    console.log('📋 Ready to integrate with your PG booking system');
    
    // Auto-detect if we're on payment success page
    if (window.location.pathname.includes('payment-success')) {
        handlePaymentSuccessPage();
    }
    
    // Auto-integrate with form if present
    document.addEventListener('DOMContentLoaded', () => {
        integrateWithPGBookingForm();
    });
}
