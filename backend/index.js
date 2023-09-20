const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const mongoose = require('mongoose')
const Request = require('./models/request')
const { Client } = require('pg')

app.use(function(req,res,next){
  req.io = io;
  next();
});

app.use(express.static('build'));
app.use('/:bin_id', express.static('build'));
const cors = require('cors')
app.use(cors());
app.use(express.json())
// const path = require('path');

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

// app.get('/', async (request, response) => {
//   response.status(200);
// })

const registerRequest = async (request, response, binPath, method) => {
  console.log('### MONGO CONNECTED -- ACCEPT REQUEST');
  console.log(binPath)
  const stringRequestHeader = JSON.stringify(request.headers);
  const stringRequestBody = JSON.stringify(request.body);
  const newKey = generateKey(15);
  // console.log(`#### Request Body: ${stringRequestBody}`)
  const req = new Request({
    key: newKey,
    header: stringRequestHeader,
    body: stringRequestBody,
  });

  const savedRequest = await req.save()
  console.log('### SAVED REQUEST TO MONGO', binPath)

  const pg = connectToPg()
  await pg.connect()
  console.log('### Postgres CONNECTED');


  let binId;
  await pg.query('SELECT id FROM bin WHERE bin_path = $1', [binPath])
    .then(result => {
      console.log(result.rows)
      binId = result.rows[0].id
    })

  console.log("binId", binId)
  // mongoId: used to get specific request from Mongo DB (because Mongo's id is garbage format)
  const mongoId = newKey;
  // mongoPath: used in unique, public request URL (can't be the same as mongoId b/c security ~~)
  const mongoPath = generateKey(15);
  const httpMethod = method;
  const httpPath = `/webhook/${binPath}/${mongoPath}`

  await pg.query('INSERT INTO requests (bin_id, mongo_id, mongo_path, http_method, http_path)' +
    'VALUES ($1, $2, $3, $4, $5)', [binId, mongoId, mongoPath, httpMethod, httpPath])

  let latestRequestTable = {};
  await pg.query('SELECT * FROM requests WHERE bin_id = $1 ORDER BY RECIEVED_AT DESC ' +
    'LIMIT 1', [binId])
    .then((result) => {
      pg.end()
      console.log(`$$$$$$$$ ${JSON.stringify(result.rows)}`)
      latestRequestTable['requestData'] = result.rows;
      latestRequestTable['path'] = binPath;
    })

  request.io.sockets.emit('newRequest', latestRequestTable);
  response.status(201).send('### SOMETHING FOR TERMINAL l.79###')
}

// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>')
// })

app.get('/webhook/:bin_path', async (request, response) => {
  registerRequest(request, response, request.params.bin_path, "GET")
})

app.post('/webhook/:bin_path', async (request, response) => {
  console.log(request.params.bin_path)
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

///// FETCH REQUESTS 
app.get('/:bin_path/:mongo_id', async (request, response) => {
  const mongoId = request.params.mongo_id
  // we are supposed to search by key?
  let singleRequest = await Request.find({key:`${mongoId}`}).exec();
  console.log('### Mongo QUERIED 123');
  console.log(mongoId)
  console.log(singleRequest)
  response.send(singleRequest)
})

///// NEW BIN
app.post('/new_bin', async (request, response) => {
  const binPath = generateKey(15)
  console.log(`#### GENERATED ${binPath}`)
  const pg = connectToPg()
  await pg.connect()
  console.log('### Postgres CONNECTED 112');
  await pg.query('INSERT INTO bin (bin_path) values ($1)', [binPath])
    .then(() => pg.end())
  console.log(binPath, ' NEW BIN');
  response['bpath'] = binPath;
  console.log(response.bpath)
  response.send(binPath);
})

///// FETCH REQUESTS TABLE
app.post('/:binpath', async (request, response) => {
  app.use(express.static('build'));
  const binPath = request.params.binpath
  console.log(binPath, ' FETCH REQUEST TABLE')

  const pg = connectToPg()
  await pg.connect()
  console.log('### Postgres CONNECTED FETCH REQUESTS TABLE');

  let binId;
  await pg.query('SELECT id FROM bin WHERE bin_path = $1', [binPath])
    .then(result => binId = result.rows[0].id)

  await pg.query('SELECT * FROM requests WHERE bin_id = $1', [binId])
    .then((result) => {
      pg.end()
      console.log(result.rows)
      response.send({ requestData: result.rows, path: binPath })
    })
})

// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = 3001
httpServer.listen(PORT, () => {
  console.log(`### Server running on port ${PORT} ###`)
})