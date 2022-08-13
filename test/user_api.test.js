const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../App')
const api = supertest(app)
const User = require('../models/User')
const helper = require('./apitest_helper')

beforeEach(async () => {
    await User.deleteMany({}) 

    for (const user of helper.initialUsers){
        let userObj = new User(user)
        await userObj.save()
    }
})

test('Invalid username (less than 3 letter)' , async () => {
    const newObj = {
        username: "as",
        password: "123456"
    }

    const response = await api.post('/api/users').send(newObj)
    expect(response.statusCode).toBe(400)
})

test('Invalid password (less than 3 letter)' , async () => {
    const newObj = {
        username: "angus",
        password: "12"
    }

    const response = await api.post('/api/users').send(newObj)
    expect(response.statusCode).toBe(400)
})

test('No username or password' , async () => {
    const newObj = {
        password: "12"
    }

    const response = await api.post('/api/users').send(newObj)
    expect(response.statusCode).toBe(400)
})

test('duplicated username' , async () => {
    const newObj = {
        username: "Angusking",
        password: "Angus2=best",
        name:'Happy',
        _id:"6ab74fb4567"
    }

    const response = await api.post('/api/users').send(newObj)
    expect(response.statusCode).toBe(409)
})