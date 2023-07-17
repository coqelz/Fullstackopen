import { configureStore } from '@reduxjs/toolkit'
import anecdoteReducer from './reducers/anecdoteReducer'
import filterReducer from './reducers/filterReducer'
import notificationReducer from './reducers/notificationReducer'

const store = configureStore({
  reducer: {
  filter: filterReducer,
  anecdotes: anecdoteReducer,
  notification: notificationReducer
  }
})

//store.subscribe(() => console.log(store.getState()))

export default store