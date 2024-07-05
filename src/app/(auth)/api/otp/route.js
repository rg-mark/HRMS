
import db from '@src/lib/database';


 // Activate Account
 export async function POST(req,res) {
    try{
      const body = await req.json()
   const { email, otp } = body;
 
     const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND otp = ?', [email, otp]);
     if (rows.length === 0) {
       return res.json({ message: 'Invalid OTP' });
     }
 
     await db.query('UPDATE users SET status = active, otp_code = ? WHERE email = ?', [true, null, email]);
 
     return res.json({ message: 'Account activated' });
   } catch (error) {
     return res.json({ message: 'Error activating account' });
   }
 }

 export  async function handler(req) {
    if (req.method === 'POST') {
      return POST(req);
    } else {
      return res.json({ message: 'Method Not Allowed' }, {status: 405});
    }
  }