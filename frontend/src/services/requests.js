import axios from 'axios'

const mongoRequestsData = [
  {
    id: 1,
    requestHeaders: {
      'host': 'requestbinder.com/1111',
      'content-length': '97',
      'accept': 'applic... */*',
      'sec-fetch-site': 'same-origin',
      'accept-language': 'en-GB,en;q=0.9',
      'accept-encoding': 'gzip, deflate, br',
      'sec-fetch-mode': 'cors',
      'content-type': 'application/json',
      'origin': 'https:....com',
      'user-agent': 'Mozill...1.15',
      'referer': 'https:...eea1',
      'sec-fetch-dest': 'empty',
    }
  },
  {
    id: 2,
    requestHeaders: {
      'host': 'requestbinder.com/2222',
      'content-length': '97',
      'accept': 'applic... */*',
      'sec-fetch-site': 'same-origin',
      'accept-language': 'en-GB,en;q=0.9',
      'accept-encoding': 'gzip, deflate, br',
      'sec-fetch-mode': 'cors',
      'content-type': 'application/json',
      'origin': 'https:....com',
      'user-agent': 'Mozill...1.15',
      'referer': 'https:...eea1',
      'sec-fetch-dest': 'empty',
    }
  },
  {
    id: 3,
    requestHeaders: {
      'host': 'requestbinder.com/3333',
      'content-length': '97',
      'accept': 'applic... */*',
      'sec-fetch-site': 'same-origin',
      'accept-language': 'en-GB,en;q=0.9',
      'accept-encoding': 'gzip, deflate, br',
      'sec-fetch-mode': 'cors',
      'content-type': 'application/json',
      'origin': 'https:....com',
      'user-agent': 'Mozill...1.15',
      'referer': 'https:...eea1',
      'sec-fetch-dest': 'empty',
    }
  },
  {
    id: 4,
    requestHeaders: {
      'host': 'requestbinder.com/4444',
      'content-length': '97',
      'accept': 'applic... */*',
      'sec-fetch-site': 'same-origin',
      'accept-language': 'en-GB,en;q=0.9',
      'accept-encoding': 'gzip, deflate, br',
      'sec-fetch-mode': 'cors',
      'content-type': 'application/json',
      'origin': 'https:....com',
      'user-agent': 'Mozill...1.15',
      'referer': 'https:...eea1',
      'sec-fetch-dest': 'empty'
    }
  },
]

// const pgRequestsData = [
//   {
//     id: 1,
//     bin_id: 1,
//     mongo_id: 1,
//     http_method: 'GET',
//     http_path: '/webhook/bin_number/request_number'
//   },
//   {
//     id: 2,
//     bin_id: 2,
//     mongo_id: 2,
//     http_method: 'POST',
//     http_path: '/webhook/bin_number/request_number'
//   },
//   {
//     id: 3,
//     bin_id: 3,
//     mongo_id: 3,
//     http_method: 'DELETE',
//     http_path: '/webhook/bin_number/request_number'
//   },
//   {
//     id: 4,
//     bin_id: 4,
//     mongo_id: 4,
//     http_method: 'GET',
//     http_path: '/webhook/bin_number/request_number'
//   },
// ]

// const bin = { id: 1, bin_path: 'aabioueriow9343', created_at: '09-13-2023' }

// creates a new bin and pings it, before returning
const createBin = async () => {
  const response1 = await axios.post('http://localhost:3001/new_bin')
  const bin = response1.data.path
  // handled by registerRequests in backend
  await axios({
    method: 'post',
    url: `http://localhost:3001/webhook/${bin}`,
    data: {
      firstName: 'Fred',
      lastName: 'Flintstone'
    }
  });
  return response1.data
}

// fetch mongo data based on clicked request (untested)
const fetchMongoData = async (bin_path, mongo_id) => {
  const response = await axios.get(`http://localhost:3001/${bin_path}/${mongo_id}`)
  console.log(response.data)
  return response.data
}

// fetch PG Requests row that matches current bin path (should contain the auto ping on new bin creation)
const fetchPgData = async (binPath) => {
  const response = await axios.get(`http://localhost:3001/${binPath}`)
  console.log(response.data)
  return response.data
}

const exportable = { createBin, fetchMongoData, fetchPgData }

export default exportable
