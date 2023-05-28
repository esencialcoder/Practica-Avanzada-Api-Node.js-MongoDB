const { Schema, model } = require("mongoose");

const schemasession = new Schema({
  userId: String,
  session_date: Date,
  ip: String

})

module.exports = model('sessions', schemasession)