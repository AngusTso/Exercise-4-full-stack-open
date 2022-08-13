const blogRoute = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

//helper function for get token 
blogRoute.get('/' , async (request, response) => {
  const blogs = await Blog.find({})
  return response.json(blogs)
})

blogRoute.post('/', async (request, response,next) => {
    try{
      const body = request.body
      const user = request.user
      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: body.user,
        _id: body._id,
      })
      const result = await blog.save()
      user.blogs = user.blogs.concat(result.id)
      const happy = await user.save()
      return response.status(201).send({status: "success"})
      
    }
    catch(err){
      next(err)
    }
})

blogRoute.delete('/:id' , async (request, response, next) => {
  try{
    const user = request.user
    const blog = await Blog.findById(request.params.id)
    if(blog === null) return response.status(404).end()
    if(blog.user.toString() === user._id.toString()){

      await Blog.findByIdAndRemove(request.params.id)
    }
    else{
      return response.status(401).json({ error: 'Unauthorized action' })
    }
    return response.status(204).end()
  }
  catch(err){
    next(err)
  }
})

blogRoute.put('/', async (request, response, next) => {
  try{
    const blog = request.body
    const result = await Blog.findOneAndUpdate({ title: blog.title }, { author:blog.author } , { new: true, runValidators: true, context: 'query' })
    response.status(200).json(result)
  }
  catch(err) {
    next(err)
  }
})

module.exports = blogRoute