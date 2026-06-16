import { useState } from "react"
import axios from 'axios'


const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const getCountries = () => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)})
  }
  return (
    <div>
    </div>
  )
}