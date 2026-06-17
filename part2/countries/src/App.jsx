import { useState } from "react"
import axios from 'axios'
import { useEffect } from "react"
const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const getCountries = () => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)})
  }
  useEffect(getCountries, [])
  const handleSearchUpdate = (event) => {
  setSearch(event.target.value)
  }
  const countriesToShow = countries.filter(c => 
    c.name.common.toLowerCase().includes(search.toLowerCase())
  )
  const Country = countriesToShow[0]
  return (
    <div>
      <input name="search" onChange={handleSearchUpdate} value={search}></input>
      {countriesToShow.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}
      {countriesToShow.length <= 10 && countriesToShow.length > 1 && (
        countriesToShow.map(c =>
          <p key={c.cca3}>{c.name.common}</p>
        )
      )} 
      {countriesToShow.length === 1 && (
        <div>
          <h1>{countriesToShow[0].name.common}</h1>
          <p>capital {countriesToShow[0].capital?.[0]}</p>
          <p>area {countriesToShow[0].area}</p>
          <h3>languages:</h3>
          <ul>
            {Object.values(countriesToShow[0].languages).map(language => (
            <li key={language}>{language}</li>
            ))}
          </ul>
          <img src={countriesToShow[0].flags.png} alt="flag" width="150" />
        </div>
      )}
</div>
  )
}
export default App
