const mongoose = require('mongoose');
const User = require('../models/User');
const OTP = require('../models/OTP');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const BASE_URL = 'http://localhost:3001/api';
const TEST_EMAIL = 'verify_flow_test@example.com';
const TEST_PASS = 'password123';
const TEST_PHONE = '9876543210';

async function runTest() {
    console.log('🚀 Starting Verification Flow...');

    // 1. Connect to DB to clean up
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zynkly');
    console.log('📦 Connected to MongoDB');

    try {
        // CLEANUP
        await User.deleteOne({ email: TEST_EMAIL });
        await OTP.deleteMany({ email: TEST_EMAIL });
        // We'll clean up bookings later or let them persist for inspection

        // 2. REQUEST OTP
        console.log('\n📧 Requesting OTP...');
        const sendOtpRes = await fetch(`${BASE_URL}/auth/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: TEST_EMAIL,
                name: 'Verification Bot'
            })
        });

        const sendOtpData = await sendOtpRes.json();
        console.log('Response:', sendOtpRes.status, sendOtpData);

        if (sendOtpRes.status !== 200) throw new Error('Failed to send OTP');

        // 3. GET OTP FROM DB (Simulate checking email)
        const otpRecord = await OTP.findOne({ email: TEST_EMAIL }).sort({ createdAt: -1 });
        if (!otpRecord) throw new Error('OTP not found in DB');
        console.log(`🔓 Retrieved OTP from DB: ${otpRecord.otp}`);

        // 4. VERIFY & REGISTER
        console.log('\n📝 Verifying & Registering...');
        const registerRes = await fetch(`${BASE_URL}/auth/verify-otp-and-register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Verification Bot',
                email: TEST_EMAIL,
                password: TEST_PASS,
                phone: TEST_PHONE,
                otp: otpRecord.otp
            })
        });

        const registerData = await registerRes.json();
        console.log('Response:', registerRes.status, registerData);

        if (registerRes.status !== 201) throw new Error('Registration failed');
        const token = registerData.token;
        console.log('🔑 Got Auth Token');

        // 5. CREATE BOOKING
        console.log('\n📅 Creating Booking...');
        // Find a service first
        const service = await Service.findOne({});
        if (!service) throw new Error('No services found in DB to book');

        const bookingPayload = {
            serviceId: service._id,
            date: new Date().toISOString().split('T')[0], // Today
            time: '14:00',
            PgName: 'Test PG',
            RoomNo: '101',
            Landmark: 'Near Test Park',
            specialInstructions: 'Verify my address please',
            plan: 'one-time',
            bookingType: 'scheduled'
        };

        const createBookingRes = await fetch(`${BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bookingPayload)
        });

        const createBookingData = await createBookingRes.json();
        console.log('Response:', createBookingRes.status, createBookingData);

        if (createBookingRes.status !== 201) throw new Error('Booking creation failed');

        // 6. VERIFY BOOKING DATA (DASHBOARD CHECK)
        console.log('\n🔍 Verifying Booking Data...');
        const getBookingsRes = await fetch(`${BASE_URL}/bookings`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const bookings = await getBookingsRes.json();
        const myBooking = bookings.find(b => b._id === createBookingData._id);

        if (!myBooking) throw new Error('Booking not found in list');

        console.log('Booking Address Data:');
        console.log(`- PgName: ${myBooking.PgName}`);
        console.log(`- RoomNo: ${myBooking.RoomNo}`);
        console.log(`- Landmark: ${myBooking.Landmark}`);

        if (myBooking.PgName === 'Test PG' && myBooking.RoomNo === '101' && myBooking.Landmark === 'Near Test Park') {
            console.log('\n✅ VERIFICATION SUCCESSFUL: Address fields are correctly saved and retrieved.');
        } else {
            console.error('\n❌ VERIFICATION FAILED: Address fields do not match.');
        }

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
    } finally {
        await mongoose.connection.close();
    }
}

runTest();
