const mongoose = require('mongoose');
const Property = require('./models/Property');
const dotenv = require('dotenv');
dotenv.config();

async function checkProperties() {
  await mongoose.connect(process.env.DATABASE_URL);
  const properties = await Property.find().limit(5);
  console.log(JSON.stringify(properties, null, 2));
  process.exit();
}

checkProperties();
