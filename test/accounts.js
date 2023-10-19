const test = require('ava')
const supertest = require('supertest')
const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const { MongoMemoryServer } = require('mongodb-memory-server')

console.error = () => {}
const router = require('../controllers/v1/accounts.js')
const model = require('../models/account.js')
const Account = model.Account

const mongod = new MongoMemoryServer()
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/accounts', router)

const user1Id = new mongoose.Types.ObjectId()
const user2Id = new mongoose.Types.ObjectId()
const owner1Id = new mongoose.Types.ObjectId()
const owner2Id = new mongoose.Types.ObjectId()

test.before(async () => {
  await mongod.start()
  const uri = mongod.getUri()
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

// テスト用データを作成
test.beforeEach(async (a) => {
  const accounts = []
  accounts.push(
    await new Account({
      accountID: user1Id,
      accountType: 'ordinary',
      balance: 1000,
      ownerID: owner1Id
    }).save()
  )
  accounts.push(
    await new Account({
      accountID: user2Id,
      accountType: 'ordinary',
      balance: 2000,
      ownerID: owner2Id
    }).save()
  )
  a.context.accounts = accounts
})

test.afterEach.always(async () => {
  await Account.deleteMany().exec()
})

// GET /v1/accounts
test.serial('get /accounts', async (t) => {
  const res = await supertest(app).get('/accounts')
  t.is(res.status, 200)
  t.deepEqual(res.body, { message: 'success!!' })
})

// GET /v1/accounts/:accountID
test.serial('get /accounts/:accountID', async (t) => {
  const target = t.context.accounts[0]
  const res = await supertest(app).get(`/accounts/${target.accountID}`)
  t.is(res.status, 200)
  t.is(Object.keys(res.body).length, 5)
  t.is(res.body._id, t.context.accounts[0]._id.toString())
})

// GET account id is not found
test.serial('get account not found', async (t) => {
  const res = await supertest(app).get(`/accounts/${new mongoose.Types.ObjectId()}`)
  t.is(res.status, 404)
  t.deepEqual(res.body, { error: 'NotFound' })
})

// account bad request
test.serial('get account id is invalid', async (t) => {
  const res = await supertest(app).get('/accounts/invalid')
  t.is(res.status, 400)
  t.deepEqual(res.body, { error: 'BadRequest' })
})

// PUT /v1/accounts/${putData.accountID}
test.serial('put account balance', async (t) => {
  const putData = {
    accountID: user1Id,
    accountType: 'ordinary',
    balance: 9999,
    ownerID: owner1Id
  }
  const res = await supertest(app).put(`/accounts/${putData.accountID}`).send(putData)
  t.is(res.status, 200)
  t.is(res.body.balance, putData.balance)
})

// PUT account id is not found
test.serial('put account id not found', async (t) => {
  const putData = {
    accountID: user1Id,
    accountType: 'ordinary',
    balance: 9999,
    ownerID: owner1Id
  }
  const res = await supertest(app).put(`/accounts/${new mongoose.Types.ObjectId()}`).send(putData)
  t.is(res.status, 404)
  t.deepEqual(res.body, { error: 'NotFound' })
})

// PUT account bad request
test.serial('put account id is invalid', async (t) => {
  const putData = {
    accountID: user1Id,
    accountType: 'ordinary',
    balance: 9999,
    ownerID: owner1Id
  }
  const res = await supertest(app).put('/accounts/invalid').send(putData)
  t.is(res.status, 400)
  t.deepEqual(res.body, { error: 'BadRequest' })
})
