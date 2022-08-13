const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../App')
const User = require('../models/User')
const Blog = require('../models/Blog')
const api = supertest(app)
const helper = require('./apitest_helper')

beforeEach(async () => {
    await User.deleteMany({})
    for (let user of helper.initialUsers){
        await api.post('/api/users').send(user)
    }
    await helper.initDB()
    const list = await api.get('/api/users')
})

test('Get request to get all the blog and check length' , async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
    expect(response.headers['content-type'] ).toMatch( /json/ );
})

// Replaced by updated version with token authorization
// test('Post request to creat and add blog to the database , check length and status code to make sure post done' , async () => {
//     const newBlog = {
//         "title": "mclaren-ricciardo-move",
//         "author": "Angus",
//         "url": "https://thejudge13.com/2022/08/06/mclaren-f1-slammed-over-ricciardo-treatment/",
//         "likes": 34
//     }
//     const response = await api.post('/api/blogs').send(newBlog)
//     expect(response.statusCode).toBe(201)

//     const blog = await api.get('/api/blogs')
//     expect(blog.body).toHaveLength(helper.initialBlogs.length + 1)   
// })

test('Verifies the unique identifier property of the blog posts' , async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined();
    expect(response.body[0]._id).toBe(undefined);
})

//abandoned version of test
// test('Check if likes propety missing , there will be default 0 like' , async () => {
//     const newObj = {
//         "title": "mclaren-ricciardo-move",
//         "author": "Angus",
//         "url": "https://thejudge13.com/2022/08/06/mclaren-f1-slammed-over-ricciardo-treatment/"
//     }

//     const response = await api.post('/api/blogs').send(newObj)
//     expect(response.body.likes).toBe(0)
// })

test('if content missing , the request should return with a 400 bad request status code' , async () => {
    const newObj = {
        "title": "mclaren-ricciardo-move",
        "likes": 34
    }

    const response = await api.post('/api/blogs').send(newObj)
    expect(response.status).toBe(400)
})
//old version of delete (new delete is use with )
// test('Delete content from db and return correct status code' , async () => {
//     const deleteID = "5a422aa71b54a676234d17f8"

//     const response = await api.delete('/api/blogs/5a422aa71b54a676234d17f8')
//     expect(response.status).toBe(204)

//     const getResult = await api.get('/api/blogs')
//     expect(getResult.body).toHaveLength(helper.initialBlogs.length - 1)
// })

test('Update content and return correct status code' , async () => {
    const newBlog = {
        title: "React patterns",
        author: "Angus Tso",
    }

    const response = await api.put('/api/blogs').send(newBlog)
    expect(response.statusCode).toBe(200)
    expect(response.body.author).toMatch( /Angus/ )
})

describe('Authorization related' , () => {
    test('Login and post request' , async () => {
        const loginInfo = {
            username: 'Angusking',
            password: "Angus2=best",
        }
        const newBlog = {
            _id: "5a422a851b54a676234d17f7",
            title: "Love you 3000",
            author: "Iron Man",
            url: "https://popbee.com/lifestyle/movies/avengers-endgame-love-you-3000-meaning/",
            likes: 3000,
            __v: 0,
        }
        
        let result = await api.post('/api/login').send(loginInfo)
        const obj = JSON.parse(result.res.text)
        const postResult = await api.post('/api/blogs').send(newBlog).set('Authorization', `bearer ${obj.token}`)
        const number = postResult.status
        expect(number).toBe(201)
    })
})

test('Login and delete request' , async () => {
    const loginInfo = {
        username: 'Angusking',
        password: "Angus2=best",
    }

    let result = await api.post('/api/login').send(loginInfo)
    const obj = JSON.parse(result.res.text)
    const getResult = await api.get('/api/blogs')
    const response = await api.delete('/api/blogs/5f409ca71b54a676234d17fb').set('Authorization', `bearer ${obj.token}`)
    expect(response.status).toBe(204)

})
afterAll(() => {
    mongoose.connection.close()
})
