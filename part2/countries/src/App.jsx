import { useState } from "react"
import axios from 'axios'
import { useEffect } from "react"
const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [current, setCurrent] = useState(null)
  const getCountries = () => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)})
  }
  useEffect(getCountries, [])
  const handleSearchUpdate = (event) => {
  setSearch(event.target.value)
  setCurrent(null)
  }
  const countriesToShow = countries.filter(c => 
    c.name.common.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div>
      <input name="search" onChange={handleSearchUpdate} value={search}></input>
      {countriesToShow.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}
      {countriesToShow.length <= 10 && countriesToShow.length > 1 && (
        countriesToShow.map(c =>
          <div key={c.cca3}>
          <p>{c.name.common}</p>
          <button onClick={() => {
              setCurrent(c)
              setSearch(c.name.common)
              }}>learn more</button>
          </div>
        )
      )}
      {current && (
        <div>
          <h1>{current.name.common}</h1>
          <p>capital {current.capital?.[0]}</p>
          <p>area {current.area}</p>
          <h3>languages:</h3>
          <ul>
            {Object.values(current.languages).map(language => (
            <li key={language}>{language}</li>
            ))}
          </ul>
          <img src={current.flags.png} alt="flag" width="150" />
        </div>
      )}
</div>
  )
}
export default App
