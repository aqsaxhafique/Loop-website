const pool = require('./config/db');

async function checkUsers() {
  try {
    const result = await pool.query('SELECT id, email, first_name, last_name, role FROM users ORDER BY id');
    console.log('\n=== Users in Database ===');
    console.log(JSON.stringify(result.rows, null, 2));
    console.log(`\nTotal users: ${result.rows.length}`);
    process.exit(0);
  } catch (err) {
    console.error('Error checking users:', err.message);
    process.exit(1);
  }
}

checkUsers();
