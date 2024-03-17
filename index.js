console.log('Local Test')

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Note = require('./models/note')

morgan.token('data', function getData(request){
  //console.log(request.body)
  if (request.body.name && request.body.number) {
    return JSON.stringify({ 'name': request.body.name,'number': request.body.number })
  }
  return ''
})

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted ID' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.get('/', (request, response) => {
  response.send('<h1>Welcome to the Phonebook! [v3]</h1>')
})

app.get('/info', (request, response) => {
  let count = 0
  Note.find({}).then(notes => {
    count += notes.length
  }).then( notes => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
  })
})

app.get('/api/persons', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Note.findById(request.params.id).then(notes => {
    if (notes) {
      response.json(notes)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const note = new Note({
    name: body.name,
    number: body.number,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const note = {
    name: body.name,
    number: body.number,
  }

  Note.findByIdAndUpdate(
    request.params.id,
    note,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next (error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
