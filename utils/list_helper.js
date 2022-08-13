var _ = require('lodash');

const dummy = (blogs) => {
    return 1
  }


const totalLikes = (blogs) => {
  let acc = 0
  if(blogs.length === 0) return 0
  blogs.forEach((blog) => {
    acc += blog.likes
  })
  return acc
}

const favouriteBlog = (blogs) => {
  let favindex = 0
  let max = 0
  blogs.forEach((blog , index) => {
    if(blog.likes >= max){
      max = blog.likes
      favindex = index
    }
  })
  return blogs[favindex]
}

const mostBlogs = (blogs) => {
  const authorlist = []
  blogs.forEach((blog) => {
    let notexist = true
    authorlist.forEach((authorblog) => {
      if(authorblog.author ===  blog.author) notexist = false
    })

    if(authorlist.length === 0 || notexist)
    {
      const newobj = {
        author: blog.author,
        blog: 1
      }
      authorlist.push(newobj)
    }
    else if(!notexist){
      authorlist.forEach((authorblog) => {
        if(authorblog.author ===  blog.author){
          authorblog.blog += 1
        }
      })
    }
  })
  let max = 0
  let most = 0
  authorlist.forEach((authorblog , index) => {
    if(authorblog.blog >  max ){
      max = authorblog.blog
      most = index
    } 
  })

  return authorlist[most]
}

const mostLike = (blogs) => {
  const authorlist = []
  blogs.forEach((blog) => {
    let notexist = true
    authorlist.forEach((authorblog) => {
      if(authorblog.author ===  blog.author) notexist = false
    })

    if(authorlist.length === 0 || notexist)
    {
      const newobj = {
        author: blog.author,
        likes: blog.likes
      }
      authorlist.push(newobj)
    }
    else if(!notexist){
      authorlist.forEach((authorblog) => {
        if(authorblog.author ===  blog.author){
          authorblog.likes += blog.likes
        }
      })
    }
  })
  let max = 0
  let most = 0
  authorlist.forEach((authorblog , index) => {
    if(authorblog.likes >  max ){
      max = authorblog.likes
      most = index
    } 
  })

  return authorlist[most]
}
module.exports = {
    dummy , totalLikes , favouriteBlog , mostBlogs , mostLike
}