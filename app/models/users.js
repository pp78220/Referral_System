const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  point : {
      type : Number,
      default : 0
  },
  referrer : {
    type: String,
  },
  refId: {
    type: Schema.Types.ObjectId,
    ref: "referral",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

module.exports = user = mongoose.model('userslist', UserSchema)