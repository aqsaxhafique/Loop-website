const http = require('http');

function makeRequest(path, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (err) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

async function testLogin() {
  try {
    console.log('\n=== Testing Admin Login ===');
    const adminLogin = await makeRequest('/api/auth/login', {
      email: 'admin@loop.com',
      password: 'admin123'
    });
    
    if (adminLogin.status === 200) {
      console.log('✅ Admin Login Success!');
      console.log('Token:', adminLogin.data.token.substring(0, 50) + '...');
      console.log('User:', JSON.stringify(adminLogin.data.user, null, 2));
    } else {
      console.log('❌ Admin Login Failed:', adminLogin.data);
    }

    console.log('\n=== Testing Customer Login ===');
    const customerLogin = await makeRequest('/api/auth/login', {
      email: 'test@loop.com',
      password: 'test123'
    });
    
    if (customerLogin.status === 200) {
      console.log('✅ Customer Login Success!');
      console.log('Token:', customerLogin.data.token.substring(0, 50) + '...');
      console.log('User:', JSON.stringify(customerLogin.data.user, null, 2));
    } else {
      console.log('❌ Customer Login Failed:', customerLogin.data);
    }

    console.log('\n=== Testing Wrong Password ===');
    const wrongPassword = await makeRequest('/api/auth/login', {
      email: 'admin@loop.com',
      password: 'wrongpassword'
    });
    
    if (wrongPassword.status === 401 || wrongPassword.status === 400) {
      console.log('✅ Wrong password rejected:', wrongPassword.data.message);
    } else {
      console.log('❌ Wrong password should have been rejected');
    }

    console.log('\n✅ All login tests completed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

testLogin();
