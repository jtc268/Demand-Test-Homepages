#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/demand-testing';
const client = new MongoClient(uri);

async function createLandingPage() {
  try {
    console.log('\n🚀 Welcome to the Landing Page Creator! 🚀\n');
    
    // Get campaign details
    const name = await question('Campaign Name (e.g., "New Product"): ');
    const slug = await question('URL Slug (e.g., "new-product"): ');
    const description = await question('Description: ');
    const title = await question('Page Title: ');
    const subtitle = await question('Subtitle: ');
    const ctaText = await question('Call to Action Text (default: "Join the Waitlist"): ') || 'Join the Waitlist';
    const thankYouMessage = await question('Thank You Message (default: "Thank you for your interest! We\'ll keep you updated."): ') 
      || 'Thank you for your interest! We\'ll keep you updated.';
    const heroImageUrl = await question('Hero Image URL (leave empty for default): ');
    
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db();
    const campaignsCollection = database.collection('campaigns');
    
    // Check if slug already exists
    const existingCampaign = await campaignsCollection.findOne({ slug });
    if (existingCampaign) {
      console.error(`\n❌ Error: A campaign with the slug "${slug}" already exists.`);
      return;
    }
    
    // Create campaign
    const campaign = {
      name,
      slug,
      description,
      active: true,
      template: 'modern',
      config: {
        title,
        subtitle,
        ctaText,
        thankYouMessage,
        colors: {
          primary: '#0ea5e9',
          secondary: '#0284c7',
          background: '#f0f9ff',
          text: '#0c4a6e',
        },
        logoUrl: '',
        heroImageUrl: heroImageUrl || 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await campaignsCollection.insertOne(campaign);
    
    console.log(`\n✅ Landing page created successfully!`);
    console.log(`\n📝 Campaign Details:`);
    console.log(`- Name: ${name}`);
    console.log(`- URL: http://localhost:3000/c/${slug}`);
    console.log(`- ID: ${result.insertedId}`);
    
    console.log(`\n🔍 To view your landing page, run:`);
    console.log(`npm run dev`);
    console.log(`Then open: http://localhost:3000/c/${slug}`);
    
  } catch (error) {
    console.error('Error creating landing page:', error);
  } finally {
    await client.close();
    rl.close();
  }
}

function question(query) {
  return new Promise(resolve => {
    rl.question(query, answer => {
      resolve(answer);
    });
  });
}

createLandingPage(); 