const express = require('express')
const mongoose = require('mongoose')
const Request = require('./models/request')
const { Client } = require('pg')
const app = express()
const cors = require('cors')
app.use(cors());

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

function generateKey(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

const registerRequest = async (request, response, binPath, method) => {
  console.log('### MONGO CONNECTED -- ACCEPT REQUEST');
  const stringRequestHeader = JSON.stringify(request.headers);
  const stringRequestBody = JSON.stringify(request.body);
  const newKey = generateKey(15);
  console.log(newKey)
  const req = new Request({
    key: newKey,
    header: stringRequestHeader,
    body: stringRequestHeader
  });

  const savedRequest = await req.save()
  console.log('### SAVED REQUEST TO MONGO', binPath)

  const pg = connectToPg()
  await pg.connect()
  console.log('### Postgres CONNECTED');


  let binId;
  await pg.query('SELECT id FROM bin WHERE bin_path = $1', [binPath])
    .then(result => binId = result.rows[0].id)

  console.log("binId", binId)
  // mongoId: used to get specific request from Mongo DB (because Mongo's id is garbage format)
  const mongoId = newKey;
  // mongoPath: used in unique, public request URL (can't be the same as mongoId b/c security ~~)
  const mongoPath = generateKey(15);
  const httpMethod = method;
  const httpPath = `/webhook/${binPath}/${mongoPath}`

  await pg.query('INSERT INTO requests (bin_id, mongo_id, mongo_path, http_method, http_path)' +
    'VALUES ($1, $2, $3, $4, $5)', [binId, mongoId, mongoPath, httpMethod, httpPath])
    .then(() => pg.end())

  response.status(201).send()
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})


app.get('/webhook/:bin_path', async (request, response) => {
  registerRequest(request, response, request.params.bin_path, "GET")
})

app.post('/webhook/:bin_path', async (request, response) => {
  registerRequest(request, response, request.params.bin_path, "POST")
})

app.put('/webhook/:bin_path', async (request, response) => {
  registerRequest(request, response, request.params.bin_path, "PUT")
})

app.delete('/webhook/:bin_path', async (request, response) => {
  registerRequest(request, response, request.params.bin_path, "DELETE")
})

app.patch('/webhook/:bin_path', async (request, response) => {
  registerRequest(request, response, request.params.bin_path, "PATCH")
})

app.post('/new_bin', async (request, response) => {
  const binPath = generateKey(15)
  const pg = connectToPg()
  await pg.connect()
  console.log('### Postgres CONNECTED 109');
  pg.query('INSERT INTO bin (bin_path) values ($1)', [binPath])
    .then(() => pg.end())
  response.redirect(`/${binPath}`);
})

app.get('/:bin_path', async (request, response) => {
  const binPath = request.params.bin_path
  const pg = connectToPg()
  await pg.connect()
  console.log('### Postgres CONNECTED 119');

  let binId;
  await pg.query('SELECT id FROM bin WHERE bin_path = $1', [binPath])
    .then(result => binId = result.rows[0].id)

  pg.query('SELECT * FROM requests WHERE bin_id = $1', [binId])
    .then((result) => {
      pg.end()
      console.log(result.rows)
      response.send({ requestData: result.rows, path: binPath })
    })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`### Server running on port ${PORT} ###`)
})
