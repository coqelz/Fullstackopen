const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const jwt = require('jsonwebtoken')

let initialToken = null
beforeEach(async () => {
  const users = await helper.usersInDb()
  const user = users[0]
  await Blog.deleteMany({})
  const blogs = helper.initialBlogs.map(blog => ({
    ...blog,
    user: user.id
  }))
  initialToken = jwt.sign({ username: user.username, id: user.id }, process.env.SECRET)
  await Blog.insertMany(blogs)
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('blogs are identified with id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined()
    })
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
})

describe('adding a blog', () => {
//Test that new blog can be added and it is valid
  test('blog can be added', async () => {
    //new blog
    const users = await helper.usersInDb()
    const user = users[0]
    const newBlog = {
      title: 'Test blog',
      author: 'Test author',
      url: 'http://testurl.com',
      user: user.id,
      likes: 2
    }
    const token = jwt.sign({ username: user.username, id: user.id }, process.env.SECRET)
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'bearer ' + token)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await helper.blogsInDb()
    const titles = response.map(r => r.title)
    expect(response).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain('Test blog')
  })

  test('adding a new blog without token returns 401 Unauthorized', async () => {
    //new blog
    const users = await helper.usersInDb()
    const user = users[0]
    const newBlog = {
      title: 'Test blog',
      author: 'Test author',
      url: 'http://testurl.com',
      user: user.id,
      likes: 2
    }
    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'bearer ')
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Unauthorized')
    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length)
  })

  test('if no likes given, defaults to 0', async () => {
    const users = await helper.usersInDb()
    const user = users[0]
    //new blog
    const newBlog = {
      title: 'How to get 0 likes',
      author: 'Lonely',
      url: 'http://nolikes.com',
      user: users
    }
    const token = jwt.sign({ username: user.username, id: user.id }, process.env.SECRET)
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'bearer ' + token)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await helper.blogsInDb()
    const lastBlog = response[response.length - 1]
    expect(lastBlog.likes).toBe(0)
  })

  test('blog without title is not added', async () => {
    const users = await helper.usersInDb()
    const user = users[0]
    //new blog
    const newBlog = {
      author: 'Me',
      url: 'http://me.com',
      user: user
    }
    const token = jwt.sign({ username: user.username, id: user.id }, process.env.SECRET)
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'bearer ' + token)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length)
  })

  test('blog without url is not added', async () => {
    const users = await helper.usersInDb()
    const user = users[0]
    //new blog
    const newBlog = {
      title: 'Testing',
      author: 'Me',
      user: user.id
    }
    const token = jwt.sign({ username: user.username, id: user.id }, process.env.SECRET)
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'bearer ' + token)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const blogs2 = await helper.blogsInDb()
    expect(blogs2).toHaveLength(helper.initialBlogs.length)
  })
})


describe('deleting a blog', () => {
  test('blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', 'bearer ' + initialToken)
      .expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('updating a blog', () => {
  test('blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const oldTitle = blogToUpdate.title
    blogToUpdate.title = 'Updated'
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(201)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).not.toContain(oldTitle)
    expect(titles).toContain(blogToUpdate.title)
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'juhokokko',
      name: 'Juho Kokko',
      password: 'password',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

describe('When adding a user', () => {
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  test('creation fails with proper statuscode if username does not exist', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User validation failed: username: Path `username` is required.')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode if username is less than 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ro',
      name: 'Superuser',
      password: 'password',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('is shorter than the minimum allowed length (3).')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode if password does not exist', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  test('creation fails with proper statuscode if password is less than 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'no',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})