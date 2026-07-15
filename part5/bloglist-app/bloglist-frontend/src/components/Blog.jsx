const Blog = ({ blog, handleLike, handleDelete, user }) => {
  if (!blog) {
    return null
  }

  const showDeleteButton = user && blog.user && user.username === blog.user.username

  return (
    <div className='blog'>
      <h2>{blog.title} {blog.author}</h2>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes}
        {user &&
          <button onClick={() => handleLike(blog)}>like</button>
        }
      </div>
      <div>added by {blog.user && blog.user.name}</div>
      {showDeleteButton &&
        <button onClick={() => handleDelete(blog)}>remove</button>
      }
    </div>
  )
}

export default Blog