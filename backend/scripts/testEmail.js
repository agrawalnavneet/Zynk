require('dotenv').config();
const { sendWelcomeEmail, sendLoginEmail } = require('../utils/emailService');

async function testEmail() {
  console.log('\n🧪 Testing Nodemailer Configuration...\n');
  
  // Check if credentials are set
  console.log('📋 Configuration Check:');
  console.log('  SMTP_HOST:', process.env.SMTP_HOST || 'smtp.gmail.com (default)');
  console.log('  SMTP_PORT:', process.env.SMTP_PORT || '587 (default)');
  console.log('  SMTP_USER:', process.env.SMTP_USER ? '✅ SET' : '❌ NOT SET');
  console.log('  SMTP_PASS:', process.env.SMTP_PASS ? '✅ SET' : '❌ NOT SET');
  console.log('');

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('❌ ERROR: SMTP credentials are missing!');
    console.log('\n📝 To fix this:');
    console.log('1. Open backend/.env file');
    console.log('2. Add these lines:');
    console.log('   SMTP_HOST=smtp.gmail.com');
    console.log('   SMTP_PORT=587');
    console.log('   SMTP_USER=your_email@gmail.com');
    console.log('   SMTP_PASS=your_app_password');
    console.log('\n💡 For Gmail:');
    console.log('   - Enable 2-Factor Authentication');
    console.log('   - Go to Google Account → Security → App Passwords');
    console.log('   - Generate an App Password and use it as SMTP_PASS');
    process.exit(1);
  }

  // Test email
  const testEmail = process.env.SMTP_USER; // Send to yourself
  const testName = 'Test User';

  console.log('📧 Sending test welcome email to:', testEmail);
  console.log('   (This may take a few seconds...)\n');

  try {
    const result = await sendWelcomeEmail(testEmail, testName);
    if (result) {
      console.log('✅ SUCCESS! Welcome email sent successfully!');
      console.log('   Message ID:', result.messageId);
      console.log('   Check your inbox:', testEmail);
    } else {
      console.log('⚠️  Email function returned null (check console for details)');
    }
  } catch (error) {
    console.log('❌ ERROR sending email:');
    console.log('   ', error.message);
    console.log('\n🔍 Common issues:');
    console.log('   1. Wrong SMTP credentials');
    console.log('   2. Gmail App Password not generated correctly');
    console.log('   3. Network/firewall blocking SMTP port 587');
    console.log('   4. "Less secure app access" needs to be enabled (for some providers)');
  }

  console.log('\n');
}

testEmail();




