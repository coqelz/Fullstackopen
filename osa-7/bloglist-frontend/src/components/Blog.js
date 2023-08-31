import { useState } from 'react'
import '../index.css'


const Blog = ({ blog, handleLike, handleRemove, user }) => {

  const [info, setInfo] = useState(false)

  const toggleInfo = () => {
    setInfo(!info)
  }
  const showWhenInfo = { display: info ? '' : 'none' }

  return (
    <div className='blog'>
      {blog.title} {blog.author}
      <button onClick={toggleInfo}>{info ? 'hide' : 'view'}</button>
      <div style={showWhenInfo} className="infoContent">
        <div>{blog.url}</div>
        <div>{blog.likes}
          <button onClick={() => handleLike(blog)}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {user && user.username === blog.user.username && (
          <button id='remove' onClick={() => handleRemove(blog)}>remove</button>
        )}
      </div>
    </div>
  )
}

export default Blog