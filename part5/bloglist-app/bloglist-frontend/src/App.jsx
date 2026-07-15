import { useState, useEffect, useRef } from 'react'
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useMatch
} from 'react-router-dom'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const blogFormRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(prevBlogs => prevBlogs.concat(returnedBlog))
    setSuccessMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      navigate('/')
    } catch {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    navigate('/')
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user && blog.user.id ? blog.user.id : blog.user
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    setBlogs(prevBlogs => prevBlogs.map(b => b.id !== blog.id ? b : returnedBlog))
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )
  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(b => b.id === match.params.id)
    : null
  return (
    <div>
      <div>
        <Link to="/">blogs</Link>
        {user === null
          ? <Link to="/login" style={{ marginLeft: 10 }}>login</Link>
          : <span style={{ marginLeft: 10 }}>
              {user.name} logged in
              <button onClick={handleLogout} style={{ marginLeft: 10 }}>logout</button>
            </span>
        }
      </div>

      <h2>blogs</h2>

      <Notification message={errorMessage} />
      <Notification message={successMessage} />

      <Routes>
        <Route path="/login" element={
          user
            ? <p>You are already logged in</p>
            : loginForm()
        } />
        <Route path="/blogs/:id" element={
          <Blog blog={blog} handleLike={handleLike} handleDelete={handleDelete} user={user} />
        } />
        <Route path="/" element={
          <div>
            {user !== null &&
              <Togglable buttonLabel='create new blog' ref={blogFormRef}>
                <BlogForm createBlog={addBlog} />
              </Togglable>
            }
            <BlogList blogs={blogs} />
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App