
const mongoose = require('mongoose');

const userDetailSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User' // Reference the User schema
    },
    profilePhoto: {
      type: String, // URL path to the profile photo
      trim: true
    },
    address: {
      type: {
        streetAddress: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        postalCode: { type: String, trim: true },
        country: { type: String, trim: true }
      },
      required: false // Address can be optional
    },
    certifications: [{
      name: { type: String, trim: true },
      issuer: { type: String, trim: true },
      issuedDate: { type: Date },
      url: { type: String, trim: true } // Optional URL for the certification
    }]
  });


  const UserDetail = mongoose.model('UserDetail', userDetailSchema);

  module.exports = { UserDetail };