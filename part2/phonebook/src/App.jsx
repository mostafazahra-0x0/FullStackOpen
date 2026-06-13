import { useState } from 'react'
import Person from './components/persons'
import './App.css'
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Mostafa Zahra' }
  ]) 
  const [newName, setNewName] = useState('')
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const personObject = {
      name: newName,
    }
    setPersons(persons.concat(personObject))
    setNewName('')
  }
  return (
    <div className='phone'>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson} >
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      
      <h2>Numbers</h2>
      {persons.map(person => 
          <Person key={person.name} person={person} />
        )
      }
    </div>
  )
}
export default App