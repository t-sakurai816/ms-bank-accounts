const express = require('express')
const accounts = require('./v1/accounts.js')

const router = express.Router()

router.use('/v1/accounts', accounts)

module.exports = router
