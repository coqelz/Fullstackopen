import { useContext, } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import blogService from '../services/blogs'
import NotificationContext from '../NotificationContext'

const BlogForm = () => {

  //eslint-disable-next-line
  const [notification, dispatch] = useContext(NotificationContext)

  const queryClient = useQueryClient()

  const newBlogMutation = useMutation(blogService.create, {
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries('blogs')
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData('blogs', blogs.concat(newBlog))
    },
    onError: (exception) => {
      dispatch({ type: 'NOTIFICATION', payload: exception.response.data.error })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
    }
  })

  const addBlog = (event) => {
    event.preventDefault()
    const title = event.target.title.value
    const author = event.target.author.value
    const url = event.target.url.value
    event.target.title.value = ''
    event.target.author.value = ''
    event.target.url.value = ''

    newBlogMutation.mutate({ title: title, author: author, url: url })
    dispatch({ type: 'NOTIFICATION', payload: `new blog ${title} ${author} added` })
    setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)

  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id='title'
            type="text"
            name="Title"
            onChange={event => event.target.value}
            placeholder='write blog title here'
          />
        </div>
        <div>
          author:
          <input
            id='author'
            type="text"
            name="Author"
            onChange={event => event.target.value}
            placeholder='write blog author here'
          />
        </div>
        <div>
          url:
          <input
            id='url'
            type="text"
            name="Url"
            onChange={event => event.target.value}
            placeholder='write blog url here'
          />
        </div>
        <button type="submit" id='create-button' >create</button>
      </form>
    </div>
  )
}

export default BlogForm