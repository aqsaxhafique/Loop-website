const pool = require('./config/db');

async function seedData() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Insert Categories
    console.log('📁 Inserting categories...');
    await pool.query(`
      INSERT INTO categories (name, slug, description, image_url) 
      VALUES 
        ('Pancakes', 'pancakes', 'Fluffy and delicious pancakes', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445'),
        ('Waffles', 'waffles', 'Crispy golden waffles', 'https://images.unsplash.com/photo-1562376552-0d160a2f238d'),
        ('Savory', 'savory', 'Savory treats and meals', 'https://images.unsplash.com/photo-1513442542250-854d436a73f2'),
        ('Desserts', 'desserts', 'Sweet desserts and treats', 'https://images.unsplash.com/photo-1551024506-0bccd828d307')
      ON CONFLICT (slug) DO NOTHING
    `);
    console.log('✅ Categories inserted\n');

    // Get category IDs
    const categoriesResult = await pool.query('SELECT id, slug FROM categories');
    const categories = {};
    categoriesResult.rows.forEach(cat => {
      categories[cat.slug] = cat.id;
    });

    // Insert Products
    console.log('🥞 Inserting products...');
    await pool.query(`
      INSERT INTO products (category_id, title, slug, description, price, offer_percentage, stock, image_url, is_available) 
      VALUES 
        -- Pancakes
        ($1, 'Classic Buttermilk Pancakes', 'classic-buttermilk-pancakes', 'Fluffy buttermilk pancakes served with maple syrup', 299, 10, 50, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445', true),
        ($1, 'Blueberry Pancakes', 'blueberry-pancakes', 'Pancakes loaded with fresh blueberries', 349, 15, 45, 'https://images.unsplash.com/photo-1528207776546-365bb710ee93', true),
        ($1, 'Chocolate Chip Pancakes', 'chocolate-chip-pancakes', 'Pancakes with chocolate chips', 349, 0, 40, 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759', true),
        ($1, 'Banana Pancakes', 'banana-pancakes', 'Pancakes with fresh banana slices', 329, 20, 35, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', true),
        
        -- Waffles
        ($2, 'Belgian Waffles', 'belgian-waffles', 'Crispy Belgian waffles with butter and syrup', 399, 10, 30, 'https://images.unsplash.com/photo-1562376552-0d160a2f238d', true),
        ($2, 'Strawberry Waffles', 'strawberry-waffles', 'Waffles topped with fresh strawberries', 449, 15, 25, 'https://images.unsplash.com/photo-1612182062970-8310c4642111', true),
        ($2, 'Nutella Waffles', 'nutella-waffles', 'Waffles drizzled with Nutella', 479, 0, 20, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d', true),
        ($2, 'Chicken & Waffles', 'chicken-waffles', 'Savory fried chicken with waffles', 599, 25, 15, 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41', true),
        
        -- Savory
        ($3, 'Cheese Omelette', 'cheese-omelette', 'Three egg omelette with cheese', 279, 0, 60, 'https://images.unsplash.com/photo-1525351484163-7529414344d8', true),
        ($3, 'Club Sandwich', 'club-sandwich', 'Classic club sandwich with fries', 399, 10, 40, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af', true),
        ($3, 'French Toast', 'french-toast', 'Golden French toast with cinnamon', 299, 15, 45, 'https://images.unsplash.com/photo-1484723091739-30a097e8f929', true),
        ($3, 'Breakfast Burrito', 'breakfast-burrito', 'Loaded breakfast burrito', 449, 0, 30, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f', true),
        
        -- Desserts
        ($4, 'Chocolate Brownie', 'chocolate-brownie', 'Rich chocolate brownie with ice cream', 249, 20, 50, 'https://images.unsplash.com/photo-1607920591413-4ec007e70023', true),
        ($4, 'Cheesecake', 'cheesecake', 'New York style cheesecake', 349, 15, 35, 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866', true),
        ($4, 'Apple Pie', 'apple-pie', 'Homemade apple pie with cinnamon', 299, 0, 40, 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9', true),
        ($4, 'Ice Cream Sundae', 'ice-cream-sundae', 'Classic ice cream sundae with toppings', 279, 10, 60, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', true)
      ON CONFLICT (slug) DO NOTHING
    `, [categories['pancakes'], categories['waffles'], categories['savory'], categories['desserts']]);
    
    console.log('✅ Products inserted\n');

    // Show summary
    const productCount = await pool.query('SELECT COUNT(*) FROM products');
    const categoryCount = await pool.query('SELECT COUNT(*) FROM categories');
    
    console.log('📊 Database Seeding Summary:');
    console.log(`   Categories: ${categoryCount.rows[0].count}`);
    console.log(`   Products: ${productCount.rows[0].count}`);
    console.log('\n✅ Database seeding completed successfully!\n');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
    console.error(err);
    process.exit(1);
  }
}

seedData();
