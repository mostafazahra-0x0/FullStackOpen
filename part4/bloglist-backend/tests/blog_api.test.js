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
test('a blog can be deleted', async () => {
  const blogAtStart = await helper.blogsInDb()
  const blogToDelete = blogAtStart[0]
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
  const blogAtEnd = await helper.blogsInDb()
  const ids = blogAtEnd.map(b => b.id)
  assert.strictEqual(ids.includes(blogToDelete.id), false)
  assert.strictEqual(blogAtEnd.length, blogAtStart.length - 1)
})
test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  const updatedBlog = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1 
  }
  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
  const blogAtEnd = await helper.blogsInDb()
  const updatedBlogAtEnd = blogAtEnd.find(b => b.id === blogToUpdate.id)
  assert.strictEqual(updatedBlogAtEnd.likes, updatedBlog.likes)
  
})
after(async () => {
  await mongoose.connection.close()
})