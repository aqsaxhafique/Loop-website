const http = require('http');

http.get('http://localhost:5000/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Server Response:', data);
    console.log('Status:', res.statusCode);
  });
}).on('error', (err) => {
  console.error('Error connecting to server:', err.message);
});
