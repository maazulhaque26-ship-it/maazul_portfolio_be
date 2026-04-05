const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  hero: {
    name:      { type: String, default: "" },
    headline:  { type: String, default: "" },
    bio:       { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    cvUrl:     { type: String, default: "" },
  },
  about: {
    bioText:           { type: String, default: "" },
    projectsCompleted: { type: String, default: "" },
    industriesCovered: { type: String, default: "" },
    yearsExperience:   { type: String, default: "" },
  },
  pricing: [
    {
      planName: { type: String, default: "" },
      price:    { type: String, default: "" },
      period:   { type: String, default: "" },
      features: [{ type: String }],
    }
  ],
  timeline: [
    {
      category: { type: String, enum: ['Education', 'Work'], default: 'Education' },
      period:   { type: String, default: "" },
      title:    { type: String, default: "" },
      subtitle: { type: String, default: "" },
    }
  ],
  achievements: [
    {
      category: { type: String, enum: ['Achievement', 'Participation'], default: 'Achievement' },
      period:   { type: String, default: "" },
      title:    { type: String, default: "" },
      subtitle: { type: String, default: "" },
    }
  ],
  contact: {
    phone:   { type: String, default: "" },
    email:   { type: String, default: "" },
    address: { type: String, default: "" },
    socials: {
      linkedin: { type: String, default: "" },
      twitter:  { type: String, default: "" },
      dribbble: { type: String, default: "" },
      github:   { type: String, default: "" },
    }
  }
}, { timestamps: true, strict: true });

if (mongoose.models.Profile) {
  delete mongoose.models.Profile;
}

module.exports = mongoose.model('Profile', profileSchema);