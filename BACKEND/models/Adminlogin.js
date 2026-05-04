const mongoose = require("mongoose");

const adminloginSchema = new mongoose.Schema({
  email:{ type: String ,unique: true, required: true},
  name:{type:String},
  password: { type: String, unique: true, required: true },

});

const adminlogin = mongoose.model("adminlogin", adminloginSchema);

module.exports = adminlogin;