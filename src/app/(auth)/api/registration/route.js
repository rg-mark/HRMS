import nodemailer from 'nodemailer';
import { hash } from 'bcryptjs';
import crypto from 'crypto';
import db from '@src/lib/database';
import jwt from 'jsonwebtoken';
import User from '@src/lib/models/User';

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables for sensitive information
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send OTP email
const sendMail = (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP code',
    text: `Your OTP code is ${otp}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending email:', err);
      throw new Error('Failed to send email');
    }
    console.log('Email sent:', info.response);
  });
};

// Handle POST request
export const POST = async (req) => {
  try {
    const body = await req.json();
    const { first_name, last_name, username, email, password } = body;

    if (!first_name, !last_name, !username, !email, !password) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const hashedPassword = await hash(password, 10);
    const otp = crypto.randomBytes(3).toString('hex');

    // Insert user into the database
    await db.query(
      'INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, username, email, hashedPassword]
    );

    sendMail(email, otp);

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return new Response(
      JSON.stringify({ message: 'Registration successful', token }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
  } catch (error) {
    console.error('Error in registration:', error);
    return new Response(
      JSON.stringify({ message: 'Error in Registration' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
