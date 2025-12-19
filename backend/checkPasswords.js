const pool = require('./config/db');

async function checkPasswords() {
  try {
    const result = await pool.query('SELECT id, email, password_hash, role FROM users ORDER BY id');
    console.log('\n=== Users with Password Hashes ===');
    result.rows.forEach(user => {
      console.log(`\nUser: ${user.email}`);
      console.log(`ID: ${user.id}`);
      console.log(`Role: ${user.role}`);
      console.log(`Password Hash: ${user.password_hash}`);
    });
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkPasswords();
