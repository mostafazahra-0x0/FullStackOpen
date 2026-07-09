import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'Kent C. Dodds',
  url: 'https://example.com/blog',
  likes: 5,
  user: { username: 'kentcdodds' }
}

test('renders title and author, but not url or likes by default', () => {
  render(<Blog blog={blog} />)

  expect(screen.getByText(blog.title, { exact: false })).toBeDefined()
  expect(screen.getByText(blog.author, { exact: false })).toBeDefined()
  expect(screen.queryByText(blog.url)).toBeNull()
  expect(screen.queryByText(blog.likes)).toBeNull()
})
test('renders url and likes when expanded', async () => {
  render(<Blog blog={blog} />)
  const user = userEvent.setup()

  const button = screen.getByText('view')
  await user.click(button)

  expect(screen.getByText(blog.url, { exact: false })).toBeDefined()
  expect(screen.getByText(blog.likes, { exact: false })).toBeDefined()
})
test('like button calls event handler twice when clicked twice', async () => {
  const mockHandler = vi.fn()
  const user = userEvent.setup()

  render(<Blog blog={blog} handleLike={mockHandler} />)

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})