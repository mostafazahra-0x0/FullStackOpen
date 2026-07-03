const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const api = supertest(app)
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})
test('unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')
  const firstBlog = response.body[0]
  assert.ok(Object.prototype.hasOwnProperty.call(firstBlog, 'id'))
})
test('a blog can be added', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://testblog.com/',
    likes: 0,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const blogAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length + 1)
  const titles = blogAtEnd.map(blog => blog.title)
  assert.ok(titles.includes('Test Blog'))
})
test('likes defaults to 0 if not provided', async () => {
  const newBlog = {
    title: 'Test Blog Without Likes',
    author: 'Test Author',
    url: 'https://testblog.com/',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)

  assert.strictEqual(response.body.likes, 0)
})
test('blog without title and url', async () => {
  const newBlog = {
    author: 'Test Author',
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})
after(async () => {
  await mongoose.connection.close()
})