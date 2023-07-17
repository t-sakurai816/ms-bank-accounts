const express = require('express')
const model = require('../../models/account.js')
const router = express.Router()
const Account = model.Account

// http://localhost:3000/v1/accounts
router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'accountsだよ〜ん' })
  // 404を返すようにする
})

// 口座情報を表示する
router.get('/:accountID', (req, res, next) => {
  ;(async () => {
    try {
      const account = await Account.findOne({ accountID: req.params.accountID }).exec()
      if (account) {
        res.status(200).json(account)
      } else {
        res.status(404).json({ error: 'NotFound' })
      }
    } catch (err) {
      console.error(err)
      res.status(400).json({ error: 'BadRequest' })
    }
  })().catch(next)
})

// 情報を登録する。テストでしか使わない想定
router.post('/', (req, res, next) => {
  ;(async () => {
    try {
      const record = new Account({
        accountID: req.body.accountID,
        accountType: req.body.accountType,
        balance: req.body.balance,
        ownerID: req.body.ownerID
      })
      const savedRecord = await record.save()
      res.status(200).json(savedRecord)
    } catch (err) {
      console.error(err)
      res.status(400).json({ error: 'BadRequest' })
    }
  })().catch(next)
})

// 情報を編集する。送金などでも利用する
router.put('/:accountID', (req, res, next) => {
  ;(async () => {
    try {
      const { accountID } = req.params
      const updatedAccountData = req.body
      const account = await Account.findOneAndUpdate({ accountID }, updatedAccountData, { new: true })
      if (account) {
        res.status(200).json(account)
      } else {
        res.status(404).json({ error: 'NotFound' })
      }
    } catch (err) {
      console.error(err)
      res.status(400).json({ error: 'BadRequest' })
    }
  })().catch(next)
})

module.exports = router
