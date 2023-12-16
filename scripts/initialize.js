const mongoose = require('mongoose')
const Account = require('../models/account.js').Account

const dbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/account'
const options = {}
if (process.env.MONGODB_ADMIN_NAME) {
  options.user = process.env.MONGODB_ADMIN_NAME
  options.pass = process.env.MONGODB_ADMIN_PASS
  options.auth = { authSource: 'admin' }
}

const ObjectId = mongoose.Types.ObjectId
const user1Id = new ObjectId('656c96e98a40d07f8a7f68ec')
const owner1ID = 123456789
const user2Id = new ObjectId('9b4681fc66a71435c2c1270a')
const owner2ID = 923456789
const accounts = [
  {
    accountID: user1Id,
    accountName: 'テストタロウ',
    accountType: 'ordinary',
    balance: 1000000,
    ownerID: owner1ID
  },
  {
    accountID: user2Id,
    accountName: 'テストハナコ',
    accountType: 'ordinary',
    balance: 2000000,
    ownerID: owner2ID
  }
]

const initialize = async () => {
  mongoose.connect(dbUrl, options)

  await Account.deleteMany().exec()

  await Account.insertMany(accounts)
  mongoose.disconnect()
}

initialize()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('finish.')
  })
  .catch((error) => {
    console.error(error)
  })
