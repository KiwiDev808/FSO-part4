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

afterAll(() => {
  mongoose.connection.close()
})
