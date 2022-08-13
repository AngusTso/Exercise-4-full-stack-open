const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        minlength: 3,
        required: true
    },
    password: String,
    name: String,
    blogs: [
        {
          type: mongoose.Schema.Types.String,
          ref: 'Blog'
        }
    ],
    _id: {
        type:String
    }
})

module.exports = mongoose.model("User", userSchema)