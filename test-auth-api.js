const fetch = require('node-fetch');

async function testAuthAPI() {
  try {
    console.log('Testing invitations API...');
    
    const response = await fetch('http://localhost:3010/api/admin/invitations', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Response body:', text);
    
    if (response.status === 403) {
      console.log('❌ Unauthorized - this is expected without authentication');
    } else if (response.status === 500) {
      console.log('❌ Internal server error - this indicates a problem');
    } else {
      console.log('✅ API responded successfully');
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

testAuthAPI();
