import { useMutation, useQueryClient } from "react-query"
import { createAncedote } from "../requests"
import { useContext } from "react"
import NotificationContext from "../NotificationContext"

const AnecdoteForm = () => {
  
  const queryClient = useQueryClient()

  const [notification, dispatch] = useContext(NotificationContext)

  const newAnecdoteMutation = useMutation(createAncedote, {
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote))
    },
    onError: () => {
      dispatch({type: 'NOTIFICATION', payload: `too short anecdote, must have length 5 or more`})
      setTimeout(() => dispatch({type: 'CLEAR'}), 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content: content, votes: 0})
    dispatch({type: 'NOTIFICATION', payload: `anecdote '${content}' voted`})
    setTimeout(() => dispatch({type: 'CLEAR'}), 5000)
}
    
  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
