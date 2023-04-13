const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: null,
    required: true,
  },
  lastName: {
    type: String,
    default: null,
    required: true,
  },
  email: {
    type: String,
    default: null,
    required: [true, "email is manditory"],
    unique: true,
  },
  password: {
    type: String,
    default: null,
    required: [true, "password is manditory"],
  },
  token: {
    type: String,
  },
});

module.exports = mongoose.model("User", UserSchema);
