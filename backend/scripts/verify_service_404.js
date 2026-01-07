const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const API_URL = 'http://localhost:3001/api';

async function verify404Reason() {
    console.log('🚀 Testing POST /api/bookings with INVALID Service ID...');

    // Login to get token
    try {
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'fixeduser@test.com',
            password: 'password123'
        });
        const token = loginRes.data.token;

        // Try to create booking with fake Service ID
        const fakeServiceId = '654321654321654321654321'; // Valid Mongo ID format but non-existent

        try {
            await axios.post(`${API_URL}/bookings`, {
                serviceId: fakeServiceId,
                date: new Date(),
                time: '10:00',
                PgName: 'Test PG',
                RoomNo: '101',
                Landmark: 'Test',
                plan: 'one-time'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('❌ Unexpected Success: Booking created with fake service?');
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('✅ CONFIRMED: Received 404 Not Found.');
                console.log('Message:', error.response.data);
                if (error.response.data.message === 'Service not found') {
                    console.log('🎯 ROOT CAUSE FOUND: The 404 is because the SERVICE ID does not exist, NOT because the route is missing!');
                }
            } else {
                console.log('❌ Received different error:', error.response ? error.response.status : error.message);
            }
        }

    } catch (err) {
        console.error('Setup failed:', err.message);
    }
}

verify404Reason();
