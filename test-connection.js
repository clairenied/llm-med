require('dotenv').config();
const { Client } = require('pg');

async function testConnection() {
  console.log('DATABASE_URL from env:', process.env.DATABASE_URL);
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('✅ Connected to postgres');
    
    const result = await client.query('SELECT current_database(), current_user');
    console.log('Current database:', result.rows[0].current_database);
    console.log('Current user:', result.rows[0].current_user);
    
    await client.end();
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

testConnection();
