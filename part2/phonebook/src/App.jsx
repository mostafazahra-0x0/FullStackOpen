import { useState } from 'react'
import Person from './components/persons'
import './App.css'
const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState ('')
  const [filter, setFilter] = useState('')
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value )
  }
  const handleNumbreChange = (event) => {
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
    persons.find(p => p.name === newName)
    ? (
      alert(`${newName} is already added to phonebook`)
    )
    : (
      setPersons(persons.concat(personObject)) && setNewName('')
    )
    setNewName('')
    setNewNumber('')
  }
  const personsToShow = persons.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase())
  )
  return (
    <div className='phone'>
      <h2>Phonebook</h2>
      <div>
        filter shown with: <input onChange={e => setFilter(e.target.value)} />
      </div>
      <form onSubmit={addPerson} >
        <div>
          name: <input value={newName} onChange={handleNameChange} />
          number: <input value={newNumber} onChange={handleNumbreChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      
      <h2>Numbers</h2>
      {personsToShow.map(person => 
          <Person key={person.name} person={person} />
        )
      }
    </div>
  )
}
export default App
