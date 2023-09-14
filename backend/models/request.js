const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema({
  header: {
    type: String,
    required: true
  },
	body: {
    type: String,
    required: false
  },
})

requestSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Request', requestSchema)