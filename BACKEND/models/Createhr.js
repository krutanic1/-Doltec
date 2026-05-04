const mongoose = require("mongoose");

const hrSchema = new mongoose.Schema({
 name:{ type: String, required: true },
 email: { type: String, unique: true, required: true , lowercase:true },
 number: { type: String, required: true },
 password: { type: String, required: true },
 HrId: { type: String, required: true, unique: true },
});

const Createhr = mongoose.model("Createhr", hrSchema);

module.exports = Createhr;