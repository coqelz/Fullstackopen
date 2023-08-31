import { useState, useEffect, useRef, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import NotificationContext from './NotificationContext'
import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, dispatch] = useContext(NotificationContext)

  const queryClient = useQueryClient()

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
      dispatch({ type: 'NOTIFICATION', payload: 'logged in' })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch({ type: 'NOTIFICATION', payload: 'wrong credentials' })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
    }
  }


  const updateBlogMutation = useMutation(blogService.update, {
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries('blogs')
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData('blogs', blogs.map(b => b.id === newBlog.id ? newBlog : b))
    }
  })

  const handleLike = (newBlog) => {
    updateBlogMutation.mutate({ ...newBlog, likes: newBlog.likes + 1 })
  }

  const removeBlogMutation = useMutation(blogService.remove, {
    onSuccess: (blogObject) => {
      queryClient.invalidateQueries('blogs')
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData('blogs', blogs.filter(b => b.id !== blogObject.id))
    }
  })

  const handleRemove = (blogObject) => {
    removeBlogMutation.mutate(blogObject)
    dispatch({ type: 'NOTIFICATION', payload: `Removed blog ${blogObject.title} by ${blogObject.author}` })
    setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    window.location.reload()
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


  const result = useQuery('blogs', blogService.getAll, {
    refetchOnWindowFocus: false,
    retry: false
  })

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  if ( result.isError ) {
    return <div>blog service not available due to problems in server</div>
  }


  const blogs = result.data.sort((a, b) => b.likes - a.likes)

  const blogsToShow = () => {
    return blogs.map(blog =>
      <Blog key={blog.id} blog={blog} handleLike={handleLike} handleRemove={handleRemove} user={user} />
    )
  }

  const logOut = (
    <button onClick={handleLogout}>logout</button>
  )

  const Users = () => {
    return(
      <div>
        <h2>Users</h2>
        {blogs.map(blog => <div key={blog.id}>{blog.user.name}</div>)}
      </div>
    )}

  const Home = () => {
    return(
      <div>
        {!user && loginForm()}
        {user &&
          <div>
            <Togglable buttonLabel="new blog" ref={blogFormRef}>
              <BlogForm />
            </Togglable>
            {blogsToShow()}
          </div>
        }
      </div>
    )}

  return (
    <Router>
      <div>
        <Notification label={notification} />
        <h2> {!user ? 'log in to application' : 'blogs'} </h2>
        {user && <p>{user.name} logged in {logOut}</p>}
        <Routes>
          <Route path='/users' element={<Users />}/>
          <Route path='/' element={<Home />} />
        </Routes>

      </div>
    </Router>
  )
}

export default App