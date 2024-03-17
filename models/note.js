const mongoose = require('mongoose')

const url =
    `mongodb+srv://FSPB:${process.env.MONGODB_KEY}@fs-phonebook.hhtjr8a.mongodb.net/?retryWrites=true&w=majority&appName=FS-Phonebook`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /^(\d{2}|\d{3})-\d{5}\d*$/.test(v)
      },
      message: props => `${props.value} is not a valid number!`
    },
    minLength: 8,
    required: true
  },
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports =  mongoose.model('Note', noteSchema)
