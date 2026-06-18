import Persons from './components/Persons'
import './App.css'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [notifType, setNotifType] = useState('success')

  useEffect(() => {
    personService.getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const showNotification = (message, type = 'success') => {
    setNotification(message)
    setNotifType(type)
    setTimeout(() => setNotification(null), 5000)
  }
  const addPerson = (event) => {
    event.preventDefault()
    const personObject = { name: newName, number: newNumber }
    const existingPerson = persons.find(p => p.name === newName)
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService.update(existingPerson.id, personObject)
        .then(response => {
          setPersons(persons.map(p => p.id === existingPerson.id ? response.data : p))
          showNotification(`Updated ${newName}`)
        })
        .catch(() => {
          showNotification(`Information of ${existingPerson.name} has already been removed from server`, 'error')
          setPersons(persons.filter(p => p.id !== existingPerson.id))
        })
      }
    } else {
      personService.create(personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          showNotification(`Added ${newName}`)
        })
    }
    setNewName('')
    setNewNumber('')
  }
  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(() => {
          showNotification(`Information of ${person.name} has already been removed from server`, 'error')
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const personsToShow = persons.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="phone">
      <h2>Phonebook</h2>
      <Notification message={notification} type={notifType} />
      <Filter filter={filter} onChange={(e) => setFilter(e.target.value)} />
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} onDelete={deletePerson} />
    </div>
  )
}

export default App
