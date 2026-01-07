const axios = require('axios');
const crypto = require('crypto');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables manually since we are running this script directly
dotenv.config({ path: path.join(__dirname, '../.env') });

const API_URL = 'http://localhost:3001/api';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!RAZORPAY_KEY_SECRET) {
    console.error('❌ ERROR: RAZORPAY_KEY_SECRET is missing in backend/.env');
    process.exit(1);
}

// Helper to generate Razorpay signature
const generateSignature = (orderId, paymentId) => {
    const text = `${orderId}|${paymentId}`;
    return crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');
};

async function verifyPaymentFlow() {
    console.log('🚀 Starting Razorpay Payment Verification Test...');

    try {
        // 1. LOGIN
        console.log('\n🔐 Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'fixeduser@test.com', // Using the known test user
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('✅ Logged in successfully.');

        // 2. CREATE ORDER
        console.log('\n💰 Creating Razorpay Order...');
        const orderRes = await axios.post(
            `${API_URL}/payment/create-order`,
            { amount: 500, currency: 'INR' }, // 500 INR
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const { orderId, amount, currency } = orderRes.data;
        console.log(`✅ Order Created: ID=${orderId}, Amount=${amount}, Currency=${currency}`);

        if (amount !== 50000) { // 500 * 100 paise
            console.error(`❌ ERROR: Amount mismatch! Expected 50000 paise, got ${amount}`);
        }

        // 3. VERIFY PAYMENT (Simulating succesful payment)
        console.log('\n✅ Simulating Payment Verification...');
        const fakePaymentId = `pay_${Date.now()}`;
        const signature = generateSignature(orderId, fakePaymentId);

        // We need fake booking IDs to update. Since we don't want to create real bookings here unnecessarily,
        // we will try verify without bookingIds first to check if signature verification passes.
        // The backend `verify-payment` route checks signature BEFORE looking at booking IDs.

        try {
            const verifyRes = await axios.post(
                `${API_URL}/payment/verify-payment`,
                {
                    razorpay_order_id: orderId,
                    razorpay_payment_id: fakePaymentId,
                    razorpay_signature: signature,
                    bookingIds: [] // Sending empty array to skip booking updates but verify signature
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('✅ Payment Verification API Response:', verifyRes.data);
            console.log('🎉 razorpay_signature verification passed successfully!');

        } catch (verifyError) {
            console.error('❌ Payment Verification Failed:', verifyError.response ? verifyError.response.data : verifyError.message);
        }

    } catch (error) {
        console.error('❌ Test Failed:', error.response ? error.response.data : error.message);
    }
}

verifyPaymentFlow();
