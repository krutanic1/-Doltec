/**
 * ONE-TIME MIGRATION — run this ONCE then delete (or keep as a record).
 *
 * Why this is needed:
 *   A previous version of User.js had:
 *     googleId: { type: String, default: null, unique: true }
 *   That created a non-sparse unique index named "googleId_1".
 *   Because the default was null, every local-auth user stored googleId:null
 *   in MongoDB, and the unique index treated all those nulls as duplicate keys.
 *
 *   This script drops the old index.  Mongoose will then auto-create the new
 *   sparse unique index (googleId_sparse_unique) on next server start.
 *
 * Usage:
 *   node scripts/fix-googleid-index.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
  const uri = process.env.DATABASE_URL || process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌  Set DATABASE_URL in your .env file.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('✅  Connected to MongoDB');

  const db    = mongoose.connection.db;
  const col   = db.collection('users');
  const indexes = await col.indexes();

  console.log('Current indexes on users collection:');
  indexes.forEach(i => console.log(' -', i.name, JSON.stringify(i.key)));

  // Drop every old googleId index that is NOT the new sparse one
  const toDrop = indexes.filter(
    i => i.key && i.key.googleId !== undefined && i.name !== 'googleId_sparse_unique'
  );

  if (toDrop.length === 0) {
    console.log('ℹ️   No stale googleId indexes found — nothing to drop.');
  } else {
    for (const idx of toDrop) {
      await col.dropIndex(idx.name);
      console.log(`🗑️   Dropped index: ${idx.name}`);
    }
  }

  await mongoose.disconnect();
  console.log('✅  Done. Restart your backend server to apply the new sparse index.');
}

run().catch(err => {
  console.error('❌  Migration failed:', err.message);
  process.exit(1);
});
