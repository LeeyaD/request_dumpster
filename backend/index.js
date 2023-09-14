const express = require('express')
const mongoose = require('mongoose')
const Request = require('./models/request')
// we can call Mongoose methods on Request (I think)
const app = express()

mongoose.set('strictQuery', false)
console.log('### CONNECTING TO MONGO...')
mongoose.connect('mongodb://localhost:27017/requests')
  .then(() => {
    console.log('### CONNECTED TO MongoDB')
  })
  .catch((error) => {
    console.log('### ERROR CONNECTING TO MongoDB:', error.message)
  });

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.post('/test', async (request, response) => {
  console.log('### TEST CONNECTION');
  const stringRequestHeader = JSON.stringify(request.headers);
  const stringRequestBody = JSON.stringify(request.body);
  const req = new Request({
    header: stringRequestHeader,
    body: stringRequestHeader
  });

  const savedRequest = await req.save()
  response.send(`<h1>Stringified Request: ${savedRequest}</h1>`)
  console.log('### SAVED REQUEST TO MONGO')
  response.status(201)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`### Server running on port ${PORT} ###`)
})
