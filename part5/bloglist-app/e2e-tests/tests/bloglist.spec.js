const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helper')
const { before } = require('node:test')
describe('Blog app', () => {
  beforeEach(async  ({ page }) => {
    await page.goto('http://localhost:5173')
    })
  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    })
})
describe('Login tests', () => {
  beforeEach(async ({ page, request }) => {
    const resetResponse = await request.post('http://localhost:3003/api/testing/reset')
    console.log('reset status:', resetResponse.status())

    const userResponse = await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Mostafa Zahra',
        username: 'mostafa',      
        password: 'mostafazahra101'
      }
    })
    await page.goto('http://localhost:5173')
  })
  test('user can login', async ({ page }) => {
    await loginWith(page, 'mostafa', 'mostafazahra101')
    await expect(page.getByText('Mostafa Zahra logged in')).toBeVisible()
  })
  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'mostafa', 'zahra')

    const errorDiv = page.locator('.notification')
    await expect(errorDiv).toContainText('Wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('Mostafa Zahra logged in')).not.toBeVisible()
  })
  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mostafa', 'mostafazahra101')
    })
    test('user can create a blog', async ({ page }) => {
      await createBlog(page, 'hello from after 40 day', 'mostafa zahra', 'https://www.mostafazahra.com')
      await expect(page.getByText('hello from after 40 day mostafa zahra')).toBeVisible()
    })
    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'hello from after 40 day', 'mostafa zahra', 'https://www.mostafazahra.com')
    
      const blogDiv = page.getByText('hello from after 40 day mostafa zahra')
      await blogDiv.getByRole('button', { name: 'view' }).click()
    
      await expect(page.getByText('likes 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })
    test('user who created blog can delete it', async ({ page }) => {
      await createBlog(page, 'hello from after 40 day', 'mostafa zahra', 'https://www.mostafazahra.com')
    
      await page.getByRole('button', { name: 'view' }).click()
    
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()
    
      await expect(page.getByText('hello from after 40 day mostafa zahra')).not.toBeVisible()
    })
    test('only the creator can see the delete button', async ({ page, request }) => {
      await createBlog(page, 'hello from after 40 day', 'mostafa zahra', 'https://www.mostafazahra.com')
    
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Second User',
          username: 'seconduser',
          password: 'password123'
        }
      })
    
      await page.getByRole('button', { name: 'logout' }).click()
    
      await loginWith(page, 'seconduser', 'password123')
    
      await page.getByRole('button', { name: 'view' }).click()
    
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })
    test('blogs are ordered by likes, most liked first', async ({ page }) => {
      await createBlog(page, 'blog one', 'author one', 'http://one.com')
      await createBlog(page, 'blog two', 'author two', 'http://two.com')
      await createBlog(page, 'blog three', 'author three', 'http://three.com')

      await likeBlog(page, 'blog one', 1)
      await likeBlog(page, 'blog two', 3)
      await likeBlog(page, 'blog three', 2)

      const blogElements = page.locator('.blog')
      await expect(blogElements.nth(0)).toContainText('blog two')
      await expect(blogElements.nth(1)).toContainText('blog three')
      await expect(blogElements.nth(2)).toContainText('blog one')
    })
  })
})