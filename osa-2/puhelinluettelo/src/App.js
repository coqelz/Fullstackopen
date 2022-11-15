import React, { useState, useEffect } from 'react'
import data from './services/names'


const PersonForm = ({addName, newName, newNumber, changeName, changeNumber}) => (
  <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={changeName} />
        </div>
        <div>
          number: <input value={newNumber} onChange={changeNumber} />
          </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
)

const Notification = ({message}) => {
  if(message === null) {
    return null
  } else {
  return(
    <div className="message">
      {message}
    </div>
  )}
 
}

const ErrorNotification = ({message}) => {
  if(message === null) {
    return null
  } else {
  return(
    <div className="error">
      {message}
    </div>
  )}
 
}

const Names = ({names, newFilter, deleteNumber}) => {
  return(
    <div>
    {names.filter((one) => {
      return newFilter === '' || (one.name.toLowerCase().includes(newFilter.toLowerCase())) 
    }).map(name =>    
      <p key={name.name}>
          {name.name} {name.number} <button onClick={() => deleteNumber(name.id)}>delete</button> 
        </p>
      )
       }
       </div>
      )
}
    


const Filter = ({filterNames, newFilter}) =>  (
  <form>
    <div>
      filter: <input value={newFilter} onChange={filterNames}/>
    </div>
  </form>
)





const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')

  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const [goodMessage, setNewGood] = useState(null)  
  const [errorMessage, setNewError] = useState(null)



  useEffect (() => {
    data
    .getAll()
    .then(base => {
      setPersons(base)
    })
  }, [])


  const deleteNumber = (id) => {
    const numberToDelete = persons.find(n => n.id === id)
    if(window.confirm(`Delete ${numberToDelete.name}?`)) {
      data
      .remove(id)
      .then(removed => {
        setPersons(persons.concat(removed))
        setPersons(persons.filter(n => n.id !== id))
        setNewGood(`Deleted ${numberToDelete.name}`)
        setTimeout(() => {
         setNewGood(null)}, 4000)
    })
    }
  }


  const filterNames = (event) => {
    event.preventDefault()
    setNewFilter(event.target.value)
  }

  
  const addName = (event) => {
    event.preventDefault()
    const defName = {
      name: newName,
      number: newNumber
    }
    let id = 0
    let result = false
     persons.forEach(one=> {
      if(one.name === newName) {
      id = one.id
      result = true 
      }
     }
      )
    console.log(result)
    if(result) {
      if(window.confirm(`Replace number of ${newName}?`)) {
      data
      .update(id, defName)
      .then(() => {
        setPersons(persons)
      setNewGood(`Updated ${newName}`)
   setTimeout(() => {
    setNewGood(null)}, 4000)
    setNewName('')
    setNewNumber('')
    })}
  }
    else {
    
      data
      .create(defName)
      .then(added => {
    setPersons(persons.concat(added))
    setNewName('')
    setNewNumber('')
   setNewGood(`Added ${newName}`)
   setTimeout(() => {
    setNewGood(null)}, 4000)
    }).catch(error => {
      setNewError(error.response.data.error)
   setTimeout(() => {
    setNewError(null)}, 4000)
    })
  }
}

  const changeName = (event) => {
    setNewName(event.target.value)
  }
  const changeNumber = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={goodMessage} />
      <ErrorNotification message={errorMessage} />
      <Filter filterNames={filterNames} newFilter={newFilter}/>
      <h2>add a new</h2>
      <PersonForm newName={newName} addName={addName} newNumber={newNumber} 
      changeName={changeName} changeNumber={changeNumber} />
      <h2>Numbers</h2>
      <Names names={persons} newFilter={newFilter} deleteNumber={deleteNumber} />
    </div>
  )

}

export default App