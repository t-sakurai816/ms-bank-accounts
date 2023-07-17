const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'accountsだよ〜ん' })
  // 404を返すようにする
})

module.exports = router
