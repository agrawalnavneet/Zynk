const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('../models/Service');

dotenv.config();

const services = [
  {
    name: 'Deep Cleaning',
    description: 'Thorough cleaning of your entire home including hard-to-reach areas, baseboards, inside appliances, and detailed scrubbing.',
    price: 150,
    duration: 240,
    category: 'deep-cleaning',
    isActive: true,
  },
  {
    name: 'Regular Cleaning',
    description: 'Standard cleaning service including dusting, vacuuming, mopping, and bathroom cleaning.',
    price: 80,
    duration: 120,
    category: 'regular-cleaning',
    isActive: true,
  },
  {
    name: 'Move-in Cleaning',
    description: 'Complete cleaning service for your new home before you move in. Perfect for ensuring a fresh start.',
    price: 200,
    duration: 300,
    category: 'move-in-out',
    isActive: true,
  },
  {
    name: 'Move-out Cleaning',
    description: 'Comprehensive cleaning service to leave your old home spotless for the next tenants.',
    price: 200,
    duration: 300,
    category: 'move-in-out',
    isActive: true,
  },
  {
    name: 'Office Cleaning',
    description: 'Professional cleaning service for your office space, including desks, common areas, and restrooms.',
    price: 120,
    duration: 180,
    category: 'office-cleaning',
    isActive: true,
  },
  {
    name: 'Post-Construction Cleaning',
    description: 'Specialized cleaning service after construction or renovation, including dust removal and debris cleanup.',
    price: 250,
    duration: 360,
    category: 'post-construction',
    isActive: true,
  },
];

async function seedServices() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zynkly', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');

    // Insert new services
    await Service.insertMany(services);
    console.log('Seeded services successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding services:', error);
    process.exit(1);
  }
}

seedServices();

