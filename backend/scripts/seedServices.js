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
    image: 'https://images.unsplash.com/photo-1581578731117-104f2a412727?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Regular Cleaning',
    description: 'Standard cleaning service including dusting, vacuuming, mopping, and bathroom cleaning.',
    price: 80,
    pricingPlans: {
      hourly: 25,
      daily: 80,
      weekly: 500,
      monthly: 1800,
      yearly: 20000,
    },
    duration: 120,
    category: 'regular-cleaning',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1527515637-62b9a8ab4d38?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Move-in Cleaning',
    description: 'Complete cleaning service for your new home before you move in. Perfect for ensuring a fresh start.',
    price: 200,
    duration: 300,
    category: 'move-in-out',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1630699144385-d6981cfda55d?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Move-out Cleaning',
    description: 'Comprehensive cleaning service to leave your old home spotless for the next tenants.',
    price: 200,
    duration: 300,
    category: 'move-in-out',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Office Cleaning',
    description: 'Professional cleaning service for your office space, including desks, common areas, and restrooms.',
    price: 120,
    duration: 180,
    category: 'office-cleaning',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Post-Construction Cleaning',
    description: 'Specialized cleaning service after construction or renovation, including dust removal and debris cleanup.',
    price: 250,
    duration: 360,
    category: 'post-construction',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Bathroom Cleaning',
    description: 'Quick and thorough bathroom cleaning service. We provide professional cleaning within 15 minutes! Includes sanitization, scrubbing, and mirror cleaning.',
    price: 35,
    pricingPlans: {
      hourly: 35,
      daily: 120,
      weekly: 700,
      monthly: 2500,
      yearly: 28000,
    },
    duration: 15,
    category: 'quick-service',
    isActive: true,
    isQuickService: true,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Room Cleaning',
    description: 'Fast room cleaning service delivered within 15 minutes! Includes dusting, vacuuming, bed making, and organizing.',
    price: 40,
    pricingPlans: {
      hourly: 40,
      daily: 140,
      weekly: 800,
      monthly: 2800,
      yearly: 32000,
    },
    duration: 15,
    category: 'quick-service',
    isActive: true,
    isQuickService: true,
    image: 'https://images.unsplash.com/photo-1522771753014-df70f11370b7?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Kitchen Cleaning',
    description: 'Express kitchen cleaning service in just 15 minutes! Includes counter cleaning, appliance wiping, sink sanitization, and quick organization.',
    price: 45,
    pricingPlans: {
      hourly: 45,
      daily: 160,
      weekly: 900,
      monthly: 3200,
      yearly: 36000,
    },
    duration: 15,
    category: 'quick-service',
    isActive: true,
    isQuickService: true,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Laundry Services',
    description: 'Quick laundry service - wash, dry, and fold within 15 minutes! We handle your laundry needs efficiently and professionally.',
    price: 30,
    pricingPlans: {
      hourly: 30,
      daily: 100,
      weekly: 600,
      monthly: 2200,
      yearly: 25000,
    },
    duration: 15,
    category: 'quick-service',
    isActive: true,
    isQuickService: true,
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Window Cleaning',
    description: 'Professional window cleaning service. Crystal clear windows in just 15 minutes! Includes inside and outside cleaning.',
    price: 40,
    pricingPlans: {
      hourly: 40,
      daily: 140,
      weekly: 800,
      monthly: 2800,
      yearly: 32000,
    },
    duration: 15,
    category: 'quick-service',
    isActive: true,
    isQuickService: true,
    image: 'https://images.unsplash.com/photo-1527515637-62b9a8ab4d38?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Sweeping',
    description: 'Quick sweeping service for all your floors. Get your home swept clean in 15 minutes!',
    price: 25,
    pricingPlans: {
      hourly: 25,
      daily: 80,
      weekly: 500,
      monthly: 1800,
      yearly: 20000,
    },
    duration: 15,
    category: 'quick-service',
    isActive: true,
    isQuickService: true,
    image: 'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Utensils Cleaning',
    description: 'Professional utensil cleaning service. All your dishes and utensils cleaned and organized in 15 minutes!',
    price: 30,
    pricingPlans: {
      hourly: 30,
      daily: 100,
      weekly: 600,
      monthly: 2200,
      yearly: 25000,
    },
    duration: 15,
    category: 'quick-service',
    isActive: true,
    isQuickService: true,
    image: 'https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Balcony Cleaning',
    description: 'Thorough balcony cleaning service. Clean and fresh balcony in just 15 minutes! Includes sweeping, mopping, and organizing.',
    price: 35,
    pricingPlans: {
      hourly: 35,
      daily: 120,
      weekly: 700,
      monthly: 2500,
      yearly: 28000,
    },
    duration: 15,
    category: 'quick-service',
    isActive: true,
    isQuickService: true,
    image: 'https://images.unsplash.com/photo-1527515637-62b9a8ab4d38?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Dusting',
    description: 'Complete dusting service for your entire home. All surfaces dusted and cleaned in 15 minutes!',
    price: 30,
    pricingPlans: {
      hourly: 30,
      daily: 100,
      weekly: 600,
      monthly: 2200,
      yearly: 25000,
    },
    duration: 15,
    category: 'quick-service',
    isActive: true,
    isQuickService: true,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'Mopping',
    description: 'Professional mopping service for all your floors. Sparkling clean floors in 15 minutes!',
    price: 30,
    pricingPlans: {
      hourly: 30,
      daily: 100,
      weekly: 600,
      monthly: 2200,
      yearly: 25000,
    },
    duration: 15,
    category: 'quick-service',
    isActive: true,
    isQuickService: true,
    image: 'https://images.unsplash.com/photo-1527515637-62b9a8ab4d38?q=80&w=600&auto=format&fit=crop'
  },
];

async function seedServices() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zynkly');

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

