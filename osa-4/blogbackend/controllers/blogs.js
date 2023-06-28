const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).json(blog)
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'Unauthorized' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
    likes: body.likes || 0
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  const blog = await Blog.findByIdAndRemove(request.params.id)
  blog.user.toString() === user._id.toString()
    ? response.status(204).end()
    : response.status(400).json({ error: 'You are not this blogs adder' })
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  }
  await Blog.findByIdAndUpdate(request.params.id, newBlog)
  response.status(201).json(newBlog)
})

module.exports = blogsRouter