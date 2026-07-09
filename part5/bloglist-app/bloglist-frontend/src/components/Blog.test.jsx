import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author, but not url or likes by default', () => {
  const blog = {
    title: '...',
    author: '...',
    url: '...',
    likes: 5,
    user: { username: '...' }
  }

  render(<Blog blog={blog} />)

  expect(screen.getByText(blog.title, { exact: false })).toBeDefined()
  expect(screen.getByText(blog.author, { exact: false })).toBeDefined()
  expect(screen.queryByText(blog.url)).toBeNull()
  expect(screen.queryByText(blog.likes)).toBeNull()
})