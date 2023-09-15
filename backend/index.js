const express = require('express')
const mongoose = require('mongoose')
const Request = require('./models/request')
const { Client } = require('pg')

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

const connectToPg = () => {
  const client = new Client({
    host: 'localhost',
    database: 'requestInspect',
    port: 5432,
  })

  return client
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// webhook url -- need to match any bin path
app.post('/webhook', async (request, response) => {
  console.log('### MONGO CONNECTED -- NEW BIN');
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

app.post('/pgtest', async (request, response) => {
  const pg = connectToPg()
  await pg.connect()
  console.log('### Postgres CONNECTED');
  pg.query('SELECT $1::text as message', ['Hello world!'])
    .then(result => console.log(result.rows[0].message)) // Hello world!
    .then(() => pg.end())
  response.status(201).send()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`### Server running on port ${PORT} ###`)
})
