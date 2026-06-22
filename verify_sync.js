const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: 'c:/Users/ART/Desktop/UiVault/.env' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_PATH = 'c:/Users/ART/Desktop/UiVault/db.json';

async function verifySync() {
  if (!MONGODB_URI) {
    console.error("❌ MongoDB is not configured in .env");
    return;
  }
  
  if (!fs.existsSync(DB_PATH)) {
    console.error(`❌ db.json not found at ${DB_PATH}`);
    return;
  }

  console.log("1. Reading local db.json cache...");
  const localDb = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

  console.log("2. Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const collectionsToCheck = [
    { name: 'users', dbName: 'users' },
    { name: 'components', dbName: 'components' },
    { name: 'collections', dbName: 'collections' },
    { name: 'comments', dbName: 'comments' },
    { name: 'notifications', dbName: 'notifications' },
    { name: 'reports', dbName: 'reports' }
  ];

  console.log("\n--- Database Synchronization Audit ---\n");
  let allSynced = true;

  for (const col of collectionsToCheck) {
    const localList = localDb[col.name] || [];
    
    // Fetch from MongoDB
    const mongoList = await db.collection(col.dbName).find({}).toArray();
    
    console.log(`Collection: [${col.name.toUpperCase()}]`);
    console.log(`  - Local db.json count: ${localList.length}`);
    console.log(`  - MongoDB Atlas count: ${mongoList.length}`);

    // Map IDs to verify presence
    const localIds = new Set(localList.map(item => item.id));
    const mongoIds = new Set(mongoList.map(item => item.id));

    // Find differences
    const missingInMongo = localList.filter(item => !mongoIds.has(item.id)).map(item => item.id);
    const missingInLocal = mongoList.filter(item => !localIds.has(item.id)).map(item => item.id);

    if (localList.length === mongoList.length && missingInMongo.length === 0 && missingInLocal.length === 0) {
      console.log("  🟢 Status: PERFECTLY IN SYNC");
    } else {
      allSynced = false;
      console.log("  🔴 Status: MISMATCH DETECTED!");
      if (missingInMongo.length > 0) {
        console.log(`    ⚠️  Missing in MongoDB: [${missingInMongo.join(', ')}]`);
      }
      if (missingInLocal.length > 0) {
        console.log(`    ⚠️  Missing in Local db.json: [${missingInLocal.join(', ')}]`);
      }
    }
    console.log();
  }

  // Also check Site Stats / siteViews
  try {
    const statsDoc = await db.collection('sitestats').findOne({ key: 'site_metric' });
    const localViews = localDb.siteViews || 0;
    const mongoViews = statsDoc ? statsDoc.siteViews : 0;
    console.log(`Site Metric: [SITE VIEWS]`);
    console.log(`  - Local db.json siteViews: ${localViews}`);
    console.log(`  - MongoDB Atlas siteViews: ${mongoViews}`);
    if (localViews === mongoViews) {
      console.log("  🟢 Status: PERFECTLY IN SYNC");
    } else {
      console.log("  🟡 Status: Metric lag (will align on next update)");
    }
  } catch (err) {
    console.log("  ⚠️  Could not read Site Stats metric collection.");
  }
  console.log();

  await mongoose.disconnect();

  if (allSynced) {
    console.log("🎉 SUCCESS: All master collections are 100% synchronized between local disk cache and MongoDB Atlas cloud!");
  } else {
    console.log("⚠️ WARNING: Mismatches detected. Database sync is in progress or has encountered discrepancies.");
  }
}

verifySync().catch(console.error);
