import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
    const object = { content: content, votes: 0 }
    const response = await axios.post(baseUrl, object)
    return response.data
}

const update = async (object) => {
  const response = await axios.put(baseUrl + '/' + object.id, { content: object.content, votes: object.votes })
  return response.data
}

// eslint-disable-next-line
export default { getAll, createNew, update, }