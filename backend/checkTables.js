const pool = require('./config/db');

async function checkTables() {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('Tables in database:');
    result.rows.forEach(row => console.log('  -', row.table_name));
    
    // Check addresses table structure if it exists
    const addressCheck = result.rows.find(r => r.table_name === 'addresses');
    if (addressCheck) {
      const columns = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'addresses'
        ORDER BY ordinal_position
      `);
      console.log('\nAddresses table columns:');
      columns.rows.forEach(col => console.log(`  - ${col.column_name}: ${col.data_type}`));
    } else {
      console.log('\nNo addresses table found!');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit();
  }
}

checkTables();
