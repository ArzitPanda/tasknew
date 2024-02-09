const mongoose = require("mongoose");

const TempUser = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  DateOfBirth: {
    type: Date,
  },
});


module.exports = mongoose.model('TempUser',TempUser)
