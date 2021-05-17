const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('id property exist in blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Hello my name is Jack',
      author: 'Jack Man',
      url: 'https://jack-man.com/',
      likes: 11,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((n) => n.title)
    expect(titles).toContain('Hello my name is Jack')
  })

  test('if the likes property is missing the default value is set to 0', async () => {
    const newBlog = {
      title: 'Hello my name is Jack',
      author: 'Jack Man',
      url: 'https://jack-man.com/',
    }

    const { body } = await api.post('/api/blogs').send(newBlog)
    expect(body.likes).toBe(0)
  })

  test('blog without url and title is not added', async () => {
    const newBlog = {
      author: 'Jack Man',
      likes: 10,
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
  })
})

describe('update of a blog', () => {
  test('succeeds altering the likes count', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const newBlog = {
      likes: blogToUpdate.likes + 1,
    }

    const { body } = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)

    expect(body.likes).toBe(blogToUpdate.likes + 1)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map((r) => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
