require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
const mongoose = require('mongoose')
morgan.token('body', (request, response) => {
  return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))
mongoose.connect(process.env.MONGODB_URI, { family: 4 })
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Person = mongoose.model('Person', personSchema)
app.get('/', (request, response, next) => {
  response.send('<h1>hi</h1>')
})
app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
  .catch(error => next(error))
})
app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
    response.send(
    `<h3>we have ${count} people</h3>` +
    `<p>${new Date()}</p>`
    )
  })
  .catch(error => next(error))
})
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error)) 
})
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
    })
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'content missing' })
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end() 
      }
    })
    .catch(error => next(error))
})
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
