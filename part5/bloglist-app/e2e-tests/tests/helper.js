const { expect } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'create new' }).click()
  await page.getByLabel('title:').fill(title)
  await page.getByLabel('author:').fill(author)
  await page.getByLabel('url:').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.locator('div').filter({ hasText: title }).first().waitFor()
}

const likeBlog = async (page, blogTitle, times) => {
  await page.getByRole('link', { name: blogTitle, exact: false }).click()
  for (let i = 0; i < times; i++) {
    await page.getByRole('button', { name: 'like' }).click()
    await expect(page.getByText(`likes ${i + 1}`)).toBeVisible()
  }
}

module.exports = { loginWith, createBlog, likeBlog }