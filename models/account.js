const mongoose = require('mongoose')
const Schema = mongoose.Schema

const accountSchema = new Schema(
  {
    accountID: { type: Schema.Types.ObjectId, required: true, unique: true },
    accountName: { type: String, required: true },
    accountType: { type: String, required: true },
    balance: { type: Number, required: true },
    ownerID: { type: String, required: true }
  },
  {
    versionKey: false
  }
)

exports.Account = mongoose.model('Account', accountSchema)
