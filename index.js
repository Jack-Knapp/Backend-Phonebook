console.log("ello Govna")

const express = require('express')
const morgan = require('morgan')
const cors =require('cors')

morgan.token('data', function getData(request){
  //console.log(request.body)

  if (request.body.name && request.body.number) {
    return JSON.stringify({"name": request.body.name,"number": request.body.number})
  }
  return ""
})

const app =express()

//app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))


let data = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
  ]

app.get('/', (request, response) => {
    response.send('<h1>Hello World! [v2]</h1>')
})

app.get('/info', (request, response) => {
    let count = data.length
    const date = new Date()

    response.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(data)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = data.find(data => data.id === id)

    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})


app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Content Missing'
    })
  }

  const newName = data.find(data => data.name === body.name)
  if (newName) {
    return response.status(400).json({
      error: 'Name already in database'
    })
  }

  const person = {
    "name": body.name,
    "number" : body.number,
    "id": parseInt(Math.random() * 1000)
  }
  
  data = data.concat(person)

  response.json(data)
})


app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  data = data.filter(data => data.id !== id)

  response.status(204).end()  
})


const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

