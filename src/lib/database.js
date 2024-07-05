import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'babayaga254',
  database: 'hospital_referral_system',
});

//Testing the connection pool
(async () => {
  try {
const connection = await db.getConnection();
  console.log('Connected to MySQL database');

  // Release the connection back to the pool
  connection.release();
  } catch (err) {
    console.error('Error connecting to MySQL database', err);
  }

}) ();

export default db;