require('dotenv').config();
const { auth, db } = require('./config/firebase');

const seed = async () => {
  try {
    const existingUsers = await auth.listUsers();
    for (const u of existingUsers.users) {
      await auth.deleteUser(u.uid);
    }
    console.log('Cleared existing users');

    const productsSnapshot = await db.collection('products').get();
    const batch = db.batch();
    productsSnapshot.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    console.log('Cleared existing products');

    const salesSnapshot = await db.collection('sales').get();
    const salesBatch = db.batch();
    salesSnapshot.forEach(doc => salesBatch.delete(doc.ref));
    await salesBatch.commit();
    console.log('Cleared existing sales');

    const ordersSnapshot = await db.collection('orders').get();
    const ordersBatch = db.batch();
    ordersSnapshot.forEach(doc => ordersBatch.delete(doc.ref));
    await ordersBatch.commit();
    console.log('Cleared existing orders');

    const adminUser = await auth.createUser({
      email: 'admin@example.com',
      password: 'admin123',
      displayName: 'Admin',
    });
    await auth.setCustomUserClaims(adminUser.uid, { role: 'admin' });
    console.log('Created admin: admin@example.com / admin123');

    const staff1 = await auth.createUser({
      email: 'staff1@example.com',
      password: 'staff123',
      displayName: 'Staff One',
    });
    await auth.setCustomUserClaims(staff1.uid, { role: 'staff' });
    console.log('Created staff: staff1@example.com / staff123');

    const staff2 = await auth.createUser({
      email: 'staff2@example.com',
      password: 'staff123',
      displayName: 'Staff Two',
    });
    await auth.setCustomUserClaims(staff2.uid, { role: 'staff' });
    console.log('Created staff: staff2@example.com / staff123');

    const products = [
      { name: 'Spicy Mango Achar', sku: 'SKU001', description: 'Tangy raw mango with traditional Nepali spices.', price: 550, cost: 350, quantity: 50, lowStockThreshold: 5, category: 'Fruit Pickle', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/great-pickle-taste.firebasestorage.app/o/products%2Fspicymangoachar.png?alt=media' },
      { name: 'Mixed Veggie Achar', sku: 'SKU002', description: 'Seasonal veggies, mildly spiced & aromatic.', price: 480, cost: 300, quantity: 40, lowStockThreshold: 5, category: 'Vegetable Pickle', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/great-pickle-taste.firebasestorage.app/o/products%2Fmixedveggieachar.png?alt=media' },
      { name: 'Garlic & Mustard Achar', sku: 'SKU003', description: 'Creamy garlic with mustard oil — a crowd favourite.', price: 600, cost: 400, quantity: 30, lowStockThreshold: 5, category: 'Specialty Pickle', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/great-pickle-taste.firebasestorage.app/o/products%2Fgarlicmustardachary.png?alt=media' },
      { name: 'Red Chili Crunch', sku: 'SKU004', description: 'Crunchy chilli pickle with an extra kick.', price: 520, cost: 320, quantity: 45, lowStockThreshold: 5, category: 'Spicy Pickle', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/great-pickle-taste.firebasestorage.app/o/products%2Fredchillicrunch.png?alt=media' },
      { name: 'Potato Pickle', sku: 'SKU005', description: 'Soft potatoes, balanced spices — comfort food.', price: 450, cost: 280, quantity: 35, lowStockThreshold: 5, category: 'Vegetable Pickle', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/great-pickle-taste.firebasestorage.app/o/products%2Fpotatopickle.png?alt=media' },
      { name: 'Lapshi Special Achar', sku: 'SKU006', description: 'Smoky, earthy regional favourite.', price: 350, cost: 200, quantity: 25, lowStockThreshold: 5, category: 'Specialty Pickle', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/great-pickle-taste.firebasestorage.app/o/products%2Flapshispecial.png?alt=media' },
      { name: 'Big Buff Blast Achar', sku: 'SKU007', description: 'A bold and fiery pickle made with tender buffalo meat chunks, slow-cooked in aromatic Nepali masala.', price: 750, cost: 500, quantity: 20, lowStockThreshold: 5, category: 'Meat Pickle', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/great-pickle-taste.firebasestorage.app/o/products%2Fbigbuffblast.png?alt=media' },
      { name: 'Smoky Chicken Delight Achar', sku: 'SKU008', description: 'Juicy chicken bites infused with traditional herbs and spices, then pickled to perfection.', price: 650, cost: 420, quantity: 20, lowStockThreshold: 5, category: 'Meat Pickle', imageUrl: 'https://firebasestorage.googleapis.com/v0/b/great-pickle-taste.firebasestorage.app/o/products%2Fsmokychilliachary.png?alt=media' },
    ];

    const productsBatch = db.batch();
    for (const product of products) {
      const ref = db.collection('products').doc();
      productsBatch.set(ref, { ...product, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    await productsBatch.commit();
    console.log(`Created ${products.length} products`);

    console.log('\nSeed complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
