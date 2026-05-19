/**
 * Run: node scripts/create_indexes.js
 * Ensure MONGODB_URI env var is set.
 */
const path = require('path');
const { connectDB, mongoose } = require('../db');

async function ensureIndexes() {
  await connectDB();
  // require models to register indexes
  const models = [
    'Organization',
    'Permission',
    'Role',
    'TeamMember',
    'PropertyPackage',
    'Subscription',
    'Invoice',
    'Payment',
    'CreditTransaction',
    'UpgradeHistory',
    'FeaturedBooking',
    'Campaign',
    'SavedItem',
    'Notification',
    'Property',
    'SavedProperty',
    'Lead',
    'AuditLog',
    'RefreshToken',
  ];

  models.forEach((m) => {
    try {
      require(path.join('..','models', m));
    } catch (e) {
      // best effort
      console.warn('Failed to require model', m, e.message);
    }
  });

  // Ask mongoose to create indexes for all models
  const modelNames = mongoose.modelNames();
  for (const name of modelNames) {
    const Model = mongoose.model(name);
    try {
      console.log('Ensuring indexes for', name);
      await Model.createIndexes();
    } catch (err) {
      console.error('Index creation failed for', name, err.message);
    }
  }

  await mongoose.disconnect();
}

if (require.main === module) {
  ensureIndexes().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { ensureIndexes };
