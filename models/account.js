const mongoose = require('mongoose')
const Schema = mongoose.Schema

const accountSchema = new Schema(
  {
    accountID: { type: String, required: true, unique: true },
    accountType: { type: String, required: true },
    balance: { type: Number, required: true },
    ownerID: { type: String, required: true }
  },
  {
    versionKey: false
  }
)

exports.Account = mongoose.model('Account', accountSchema)
