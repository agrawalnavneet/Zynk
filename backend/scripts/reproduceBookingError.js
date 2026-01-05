const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

async function reproduce() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'fixeduser@test.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('Logged in. Token:', token.substring(0, 20) + '...');

        // 2. Get Service
        console.log('Fetching services...');
        const servicesRes = await axios.get(`${API_URL}/services`);
        const service = servicesRes.data[0];
        if (!service) throw new Error('No services found');
        console.log('Service found:', service._id, service.name);

        // 3. Create Booking
        console.log('Creating booking...');
        const bookingPayload = {
            serviceId: service._id,
            date: new Date().toISOString(),
            time: '10:00',
            PgName: 'Test PG',
            RoomNo: '101',
            Landmark: 'Near Metro',
            plan: 'one-time',
            bookingType: 'scheduled',
            totalPrice: service.price // Should be calculated by backend but sending just in case
        };

        const bookingRes = await axios.post(`${API_URL}/bookings`, bookingPayload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Booking created successfully:', bookingRes.data._id);

    } catch (error) {
        if (error.response) {
            console.error('❌ Error Status:', error.response.status);
            console.error('❌ Error Data:', error.response.data);
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

reproduce();
