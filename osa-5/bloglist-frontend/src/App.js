import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notifications from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
const { ErrorNotification, InfoNotification } = Notifications

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)
  const [user, setUser] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setInfoMessage('logged in')
      setTimeout(() => {
        setInfoMessage(null)
      }, 1000)
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLike = async (blogObject) => {
    try {
      await blogService.update(blogObject.id, blogObject)
      const updatedBlogs = blogs.map((blog) =>
        blog.id === blogObject.id ? blogObject : blog
      ).sort((a, b) => b.likes - a.likes)
      setBlogs(updatedBlogs)
    } catch (exception) {
      setErrorMessage(exception.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleRemove = async (blogObject) => {
    try {
      const remove = window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)
      if (remove) {
        await blogService.remove(blogObject.id)

        setInfoMessage(`Removed blog ${blogObject.title} by ${blogObject.author}`)
        setTimeout(() => {
          setInfoMessage(null)
        }, 5000)
        const updatedBlogs = blogs.filter((blog) => blog.id !== blogObject.id)
        setBlogs(updatedBlogs)
      }
    } catch (exception) {
      setErrorMessage(exception.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    window.location.reload()
  }

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setInfoMessage(`new blog ${newBlog.title} ${newBlog.author} added`)
      setTimeout(() => {
        setInfoMessage(null)
      }, 5000)
      newBlog.user = user
      setBlogs(blogs.concat(newBlog))
      blogFormRef.current.toggleVisibility()

    } catch (exception) {
      setErrorMessage(exception.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const blogFormRef = useRef()

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id='username'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id='password'
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id='log-in-button' type="submit">login</button>
    </form>
  )



  const blogsToShow = () => {
    return blogs.map(blog =>
      <Blog key={blog.id} blog={blog} handleLike={handleLike} handleRemove={handleRemove} user={user} />
    )
  }

  const logOut = (
    <button onClick={handleLogout}>logout</button>
  )

  return (
    <div>
      <h2> {!user ? 'log in to application' : 'blogs'} </h2>
      <ErrorNotification message={errorMessage} />
      <InfoNotification message={infoMessage} />
      {!user && loginForm()}
      {user &&
        <div>
          <p>{user.name} logged in {logOut}</p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>

          {blogsToShow()}
        </div>

      }
    </div>
  )
}

export default App