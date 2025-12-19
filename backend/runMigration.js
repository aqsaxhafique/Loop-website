require('dotenv').config();
const { Pool } = require('@neondatabase/serverless');
const ws = require('ws');
const fs = require('fs');
const path = require('path');

// Configure WebSocket for Neon
const { neonConfig } = require('@neondatabase/serverless');
neonConfig.webSocketConstructor = ws;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function runMigration() {
  try {
    console.log('🔄 Running SEO fields migration...');
    
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'migrations', 'add_seo_fields.sql'),
      'utf8'
    );
    
    await pool.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    console.log('   - Added meta_title column (VARCHAR 60)');
    console.log('   - Added meta_description column (VARCHAR 160)');
    console.log('   - Added keywords column (TEXT)');
    console.log('   - Added alt_text column (VARCHAR 125)');
    
    // Verify columns were created
    const result = await pool.query(`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name='products' 
      AND column_name IN ('meta_title', 'meta_description', 'keywords', 'alt_text')
      ORDER BY column_name;
    `);
    
    console.log('\n📋 Verified columns:');
    result.rows.forEach(row => {
      const length = row.character_maximum_length ? `(${row.character_maximum_length})` : '';
      console.log(`   - ${row.column_name}: ${row.data_type}${length}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
