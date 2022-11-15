import axios from 'axios'
/* const baseUrl = '/api/persons' */
const baseUrl = '/api/persons'

const create = (added) => {
    const request = axios.post(baseUrl, added)
    return request.then(response => response.data)
  }

  const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
  }

  const remove = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
  }

  const update = (id, newNumber) => {
    const request = axios.put(`${baseUrl}/${id}`, newNumber)
    return request.then(response => response.data)
  }


  export default {create, getAll, update, remove}