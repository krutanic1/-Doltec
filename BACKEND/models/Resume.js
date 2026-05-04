const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EducationSchema = new mongoose.Schema({
  institute: { type: String, required: true },
  degree: { type: String, required: true },
  year: { type: String, required: true },
});

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  duration: { type: String, required: true },
});

const PersonalInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true , unique: true , lowercase: true},
  phone: { type: String, required: true ,unique: true },
  address: { type: String, required: true },
});

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    personalInfo: {
      type: PersonalInfoSchema,
      required: true,
    },
    educations: {
      type: [EducationSchema],
      required: true,
    },
    experience: {
      type: ExperienceSchema,
      required: true,
    },
    skills: {
      type: String,
      required: true,
    },
    summary:{
      type:String,
      required:true
    },
    project:{
      type:String,
      required:true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resume', ResumeSchema);
