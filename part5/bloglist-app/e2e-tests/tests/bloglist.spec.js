const { test, expect, describe } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helper')

describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    const response = await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Mostafa Zahra',
        username: 'mostafa',
        password: 'mostafazahra101'
      }
    })
    console.log('user creation status:', response.status())
    console.log('user creation body:', await response.text())
    await page.goto('http://localhost:5173')
  })

  test('login form is shown at /login', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
  })

  test('user can login', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await loginWith(page, 'mostafa', 'mostafazahra101')
    await expect(page.getByText('Mostafa Zahra logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await loginWith(page, 'mostafa', 'zahra')

    const errorDiv = page.locator('.notification, [class*="notification"]')
    await expect(errorDiv).toContainText('Wrong credentials')

    await expect(page.getByText('Mostafa Zahra logged in')).not.toBeVisible()
  })

  describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await loginWith(page, 'mostafa', 'mostafazahra101')
    })

    test('user can create a blog', async ({ page }) => {
      await createBlog(page, 'hello from after 40 day', 'mostafa zahra', 'https://www.mostafazahra.com')
      await expect(page.getByRole('link', { name: 'hello from after 40 day', exact: false })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'hello from after 40 day', 'mostafa zahra', 'https://www.mostafazahra.com')
      await likeBlog(page, 'hello from after 40 day', 1)
    })

    test('user who created blog can delete it', async ({ page }) => {
      await createBlog(page, 'hello from after 40 day', 'mostafa zahra', 'https://www.mostafazahra.com')
    
      await page.getByRole('link', { name: 'hello from after 40 day', exact: false }).click()
    
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()
    
      await expect(page.getByRole('heading', { name: 'hello from after 40 day', exact: false })).not.toBeVisible()
    })

    test('only the creator can see the delete button', async ({ page, request }) => {
      test.setTimeout(60000)
      await createBlog(page, 'hello from after 40 day', 'mostafa zahra', 'https://www.mostafazahra.com')

      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Second User',
          username: 'seconduser',
          password: 'password123'
        }
      })

      await page.getByRole('button', { name: 'logout' }).click()

      await page.getByRole('link', { name: 'login' }).click()
      await loginWith(page, 'seconduser', 'password123')

      await page.getByRole('link', { name: 'hello from after 40 day', exact: false }).click()

      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })
  })
})