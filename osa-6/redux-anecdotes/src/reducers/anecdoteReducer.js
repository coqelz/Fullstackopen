import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'

//const getId = () => (100000 * Math.random()).toFixed(0)

//const initialState = anecdotesAtStart.map(asObject)
const initialState = []

/*const anecdoteReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE':
      return [...state, action.payload]
    case 'VOTE':
      const id = action.payload.id
      const anecdoteToChage = state.find(a => a.id === id)
      const changedAnecdote = {
        ...anecdoteToChage,
        votes: anecdoteToChage.votes + 1
      }
      return state.map(a => a.id !== id ? a : changedAnecdote)

    default: return state
  } 
  
}*/

/*export const createAncedote = (content) => {
  return {
    type: 'CREATE',
    payload: {
      content,
      id: getId(),
      votes: 0
    }
  }
}*/

/*export const voteAnecdote = (id) => {
  return {
    type: 'VOTE',
    payload: {
      id
    }
  }
}*/

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: initialState,
  reducers: {
    updateAnecdotes(state, action) {
      const newAnecdote = action.payload
      const id = newAnecdote.id
      return state.map(a => a.id !== id ? a : newAnecdote)
    }
    ,
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }

  }
})

export const { updateAnecdotes, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const newAnecdote = { ...anecdote, votes: anecdote.votes + 1}
    const changedAnecdote = await anecdoteService.update(newAnecdote)
    dispatch(updateAnecdotes(changedAnecdote))
  }
}

export default anecdoteSlice.reducer