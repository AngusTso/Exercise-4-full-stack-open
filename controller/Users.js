const usersRoute = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')


usersRoute.post('/' , async (request, response , next) => {
    const { username, name, password , _id } = request.body
    if(password.length < 3) return response.status(400).end()
    const saltRounds = 10
    const bcrytpassword =  await bcrypt.hash(password, saltRounds)
    try{
        const newObj = {
            _id: _id,
            username: username,
            password: bcrytpassword,
            name: name,
            blog:[]
        }
        const exist = await User.findOne({username: username})
        console.log(exist)
        if(exist !== null) return response.status(409).end()
        const newUser = new User(newObj)
        const savedUser = await newUser.save()
        response.status(201).json(savedUser)
    }
    catch(err) {
        next(err)
    }
}
)

usersRoute.get('/' , async (request, response) => {
    const result = await User.find({}).populate("blogs")
    response.json(result)
})

module.exports = usersRoute