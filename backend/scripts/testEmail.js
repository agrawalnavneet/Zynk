require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  console.log('Testing Email Configuration...');
  console.log(`SMTP_USER: ${user ? 'Set' : 'Not Set'} (${user})`);
  console.log(`SMTP_PASS: ${pass ? 'Set' : 'Not Set'}`);

  if (!user || !pass) {
    console.error('❌ Missing SMTP credentials in .env');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: user,
      pass: pass,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('✅ Connection verified successfully.');

    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: `"Test" <${user}>`,
      to: user, // Send to self
      subject: 'Test Email from Zynkly',
      text: 'If you see this, email sending is working!',
    });
    console.log('✅ Test email sent:', info.messageId);
  } catch (error) {
    console.error('❌ Email test failed:', error);
  }
}

testEmail();
