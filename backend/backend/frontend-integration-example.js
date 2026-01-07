// Frontend Integration Example - Simple Payment System
// This matches your working Shankh Jewellers approach

// Function to initiate payment (exactly like Shankh Jewellers)
async function initiatePhonePePayment(orderData, amount) {
    try {
        const amountInPaise = amount;
        const response = await fetch('https://api.pg.gradezy.in/api/simple-payment/initiate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: amountInPaise,
                userId: orderData.email,
                orderId: 'ORD_' + Math.random().toString(36).substr(2, 9),
                customerDetails: { 
                    name: `${orderData.firstName} ${orderData.lastName}`, 
                    email: orderData.email, 
                    phone: orderData.phone, 
                    address: { 
                        street: orderData.address, 
                        city: orderData.city, 
                        state: orderData.state, 
                        zip: orderData.zip, 
                        country: 'India' 
                    }
                },
                products: orderData.products || []
            })
        });
        
        const responseData = await response.json();
        if (!response.ok) { 
            throw new Error(responseData.message || 'Failed to initiate payment'); 
        }
        
        return responseData;
    } catch (error) {
        console.error('Payment initiation error:', error);
        throw new Error('Failed to connect to payment service: ' + error.message);
    }
}

// Example usage
const orderData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '9876543210',
    address: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400001',
    products: [
        { id: 1, name: 'Test Product', price: 100, quantity: 1, image: 'product.jpg' }
    ]
};

// Test the payment
async function testPayment() {
    try {
        console.log('🚀 Initiating payment...');
        const result = await initiatePhonePePayment(orderData, 100); // ₹100
        
        console.log('✅ Payment initiated successfully!');
        console.log('Transaction ID:', result.data.transactionId);
        console.log('Redirect URL:', result.data.redirectUrl);
        
        // Redirect user to PhonePe payment page
        if (result.data.redirectUrl) {
            console.log('Redirecting to PhonePe...');
            // window.location.href = result.data.redirectUrl; // Uncomment for actual redirect
        }
        
    } catch (error) {
        console.error('❌ Payment failed:', error.message);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initiatePhonePePayment };
}

// Test if running directly
if (typeof window !== 'undefined') {
    // Browser environment
    window.initiatePhonePePayment = initiatePhonePePayment;
    console.log('Payment system loaded. Use initiatePhonePePayment(orderData, amount) to test.');
}
