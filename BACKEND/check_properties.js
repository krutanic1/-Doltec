const mongoose = require("mongoose");
const Property = require("./models/Property");
require("dotenv").config();

const { connectDB } = require("./db");

const check = async () => {
  try {
    await connectDB();
    const count = await Property.countDocuments();
    console.log("Total properties in DB:", count);
    const sample = await Property.findOne();
    console.log("Sample property:", sample);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

check();
