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

const nonExistingId = async () => {
  const note = new Blog({ title: 'willremovethissoon' })
  await note.save()
  await note.remove()

  return note._id.toString()
}

const blogsInDb = async () => {
  const notes = await Blog.find({})
  return notes.map(note => note.toJSON())
}


module.exports = {
  initialBlogs, blogsInDb, nonExistingId
}