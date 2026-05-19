/**
 * fix_googleid_index.js
 * Usage: set MONGODB_URI in env and run: node scripts/fix_googleid_index.js
 * What it does (idempotent):
 *  - connects to MongoDB
 *  - unsets `googleId` where it's null
 *  - drops any existing `googleId` index
 *  - creates a partial unique index on `googleId` (only enforces uniqueness for non-null values)
 *
 * IMPORTANT: Backup your DB before running (mongodump).
 */

const mongoose = require('mongoose');
// Load .env automatically so the script can read DATABASE_URL from project .env
require('dotenv').config();

async function main() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set. Aborting.');
    process.exit(1);
  }

  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;
  const users = db.collection('users');

  try {
    const nullCount = await users.countDocuments({ googleId: null });
    console.log('Documents with googleId:null:', nullCount);

    if (nullCount > 0) {
      const r = await users.updateMany({ googleId: null }, { $unset: { googleId: "" } });
      console.log('Unset googleId on docs:', r.modifiedCount);
    } else {
      console.log('No documents with googleId:null found');
    }

    // List current indexes
    const indexes = await users.indexes();
    console.log('Current indexes:', indexes.map(ix => ix.name));

    // Find any index that includes googleId
    const googleIdx = indexes.find(ix => ix.key && Object.prototype.hasOwnProperty.call(ix.key, 'googleId'));
    if (googleIdx) {
      console.log('Found googleId index:', googleIdx.name, ' — dropping it');
      try {
        await users.dropIndex(googleIdx.name);
        console.log('Dropped index', googleIdx.name);
      } catch (err) {
        console.warn('Failed to drop index', googleIdx.name, err.message);
      }
    } else {
      console.log('No googleId index found');
    }

    // Create partial unique index on googleId (only non-null values)
    try {
      const idxName = await users.createIndex(
        { googleId: 1 },
        { unique: true, partialFilterExpression: { googleId: { $exists: true, $ne: null } } }
      );
      console.log('Created partial unique index on googleId:', idxName);
    } catch (err) {
      console.warn('Partial index creation failed, attempting sparse unique index as a fallback:', err.message);
      // Fallback: create sparse unique index which is supported on older servers
      try {
        const idxName2 = await users.createIndex({ googleId: 1 }, { unique: true, sparse: true });
        console.log('Created sparse unique index on googleId as fallback:', idxName2);
      } catch (err2) {
        console.error('Failed to create sparse fallback index:', err2);
        throw err2;
      }
    }
    console.log('Done. Please restart your backend and retry registration.');
  } catch (err) {
    console.error('Error during index fix:', err);
    process.exitCode = 2;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

main();
