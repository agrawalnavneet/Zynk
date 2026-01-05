const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zynkly')
    .then(async () => {
        console.log('MongoDB connected');

        try {
            const users = await User.find({});
            console.log(`Found ${users.length} users.`);

            const testEmail = 'fixeduser@test.com';
            const existingTestUser = await User.findOne({ email: testEmail });

            if (!existingTestUser) {
                console.log('Creating fixed test user...');
                const testUser = new User({
                    name: 'Fixed User',
                    email: testEmail,
                    password: 'password123',
                    phone: '1234567890'
                });
                await testUser.save();
                console.log(`Test user created: ${testEmail} / password123`);
            } else {
                console.log(`Test user exists: ${testEmail}`);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch((err) => console.error('MongoDB connection error:', err));
