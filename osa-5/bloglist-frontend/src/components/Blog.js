import { useState } from 'react'
import '../index.css'

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const [info, setInfo] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const toggleInfo = () => {
    setInfo(!info)
  }
  const showWhenInfo = { display: info ? '' : 'none' }

  const addLike = (event) => {
    event.preventDefault()
    handleLike({
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: likes + 1,
      user: blog.user
    })
    setLikes(likes + 1)
  }

  const removeBlog = (event) => {
    event.preventDefault()
    handleRemove(blog)
  }


  return (
    <div className='blog'>
      {blog.title} {blog.author}
      <button onClick={toggleInfo}>{info ? 'hide' : 'view'}</button>
      <div style={showWhenInfo} className="infoContent">
        <div>{blog.url}</div>
        <div>{likes}
          <button onClick={addLike}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {user && user.username === blog.user.username && (
          <button id='remove' onClick={removeBlog}>remove</button>
        )}
      </div>
    </div>
  )
}

export default Blog