import { useState } from 'react'
import Persons from './components/Persons'
import './App.css'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState ('')
  const [filter, setFilter] = useState('')
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value )
  }
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value )
  }
  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const personObject = {
      name: newName,
      number: newNumber
    }
    persons.find(p => p.name === newName)
    ? (
      alert(`${newName} is already added to phonebook`)
    )
    : (
      setPersons(persons.concat(personObject))
        )
    setNewName('')
    setNewNumber('')
  }
  const personsToShow = persons.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase())
  )
  return (
    <div className="phone">
      <h2>Phonebook</h2>
      <Filter filter={filter} onChange={(e) => setFilter(e.target.value)} />
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} />
    </div>
  );
}
export default App
