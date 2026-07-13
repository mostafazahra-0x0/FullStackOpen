import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showDeleteButton = user && blog.user && user.username === blog.user.username
  console.log('user:', user)
  console.log('blog.user:', blog.user)
  console.log('showDeleteButton:', showDeleteButton)
  return (
    <div className='blog' style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>
          {detailsVisible ? 'hide' : 'view'}
        </button>
      </div>
      {detailsVisible &&
        <div>
          <div>{blog.url}</div>
          <div>likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button></div>
          <div>{blog.author}</div>
          {showDeleteButton &&
            <button onClick={() => handleDelete(blog)}>remove</button>
          }
        </div>
      }
    </div>
  )
}

export default Blog