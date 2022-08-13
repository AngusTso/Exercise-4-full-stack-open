const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRoute = require('express').Router()
const User = require('../models/User')

loginRoute.post('/' , async (request, response) => {
    //spread props from req body
    const {username , password} = request.body
    //find user from database with the login info
    const user = await User.findOne({username: username}).exec()
    //if user is null then passwordcorrect is false (invalid username so no need to check password) , otherwise check password 
    
    const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.password)

    //return response if the user or password not correct
    if(!(user && passwordCorrect)){
        return response.status(401).json(
            {error: "Invalid password or username"}
        )
    }
    //this is for sign action by jwt
    const tokenUser = {
        username : user.username,
        id: user._id
    }
    //create token
    const token = jwt.sign(tokenUser , process.env.SECRET)
    //response with the token
    response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRoute