const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
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
    const newBlog = {
      title: 'Test blog',
      author: 'Test author',
      url: 'http://testurl.com',
      likes: 0
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await helper.blogsInDb()
    const titles = response.map(r => r.title)
    expect(response).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain('Test blog')
  })

  test('if no likes given, defaults to 0', async () => {
    //new blog
    const newBlog = {
      title: 'How to get 0 likes',
      author: 'Lonely',
      url: 'http://nolikes.com'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await helper.blogsInDb()
    const lastBlog = response[response.length - 1]
    expect(lastBlog.likes).toBe(0)
  })

  test('blog without title or url is not added', async () => {
    const noTitle = {
      author: 'Me',
      url: 'http://me.com'
    }
    await api
      .post('/api/blogs')
      .send(noTitle)
      .expect(404)
      .expect('Content-Type', /application\/json/)

    const response = await helper.blogsInDb()
    expect(response).toHaveLength(helper.initialBlogs.length)

    const noUrl = {
      title: 'Testing',
      author: 'Me',
    }
    await api
      .post('/api/blogs')
      .send(noUrl)
      .expect(404)
      .expect('Content-Type', /application\/json/)
    const response1 = await helper.blogsInDb()
    expect(response1).toHaveLength(helper.initialBlogs.length)
  })
})


describe('deleting a blog', () => {
  test('blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
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

afterAll(() => {
  mongoose.connection.close()
})