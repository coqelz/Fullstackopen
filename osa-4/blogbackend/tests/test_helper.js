const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'the first blog',
    author: 'Aj Lehman',
    url: 'http://blogon',
    likes: 12,
  },
  {
    title: 'On god',
    author: 'One and only',
    url: 'http://whatis42',
    likes: 1023302,
  },
]

module.exports = {
  initialBlogs
}