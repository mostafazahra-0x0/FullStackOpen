const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')
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
  })
})