import { compare } from 'bcryptjs';
import User from '@src/lib/models/User';
import jwt from 'jsonwebtoken';

export const POST = async (req) => {
  const { email, password } = await req.json();
  
  // Validate email and password
  if (!email || !password) {
    return new Response(
      JSON.stringify({ message: 'Please provide an email and password' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Retrieve user from the database
  try {
    const user = await User.findByEmail(email);
    
    // Check if user exists and password is correct
    if (!user || !(await compare(password, user.password))) {
      return new Response(
        JSON.stringify({ message: 'Invalid email or password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Create session for the user
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    
    return new Response(
      JSON.stringify({ token }),
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: 'Error in Login...' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
