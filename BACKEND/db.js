const mongoose = require('mongoose');

const MONGODB_URI = process.env.DATABASE_URL || process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.warn('No MongoDB URI configured in DATABASE_URL or MONGODB_URI');
}

const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 5,
  socketTimeoutMS: 20000,
};

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (!MONGODB_URI) {
      throw new Error('Missing MONGODB_URI / DATABASE_URL environment variable');
    }
    cached.promise = mongoose
      .connect(MONGODB_URI, mongooseOptions)
      .then((mongooseInstance) => {
        return mongooseInstance.connection;
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = { connectDB, mongoose };
