// import axios from 'axios'
// const baseUrl = '/api/contacts'

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

const pgRequestsData = [
  {
    id: 1,
    bin_id: 1,
    mongo_id: 1,
    http_method: 'GET',
    http_path: '/webhook/bin_number/request_number'
  },
  {
    id: 2,
    bin_id: 2,
    mongo_id: 2,
    http_method: 'POST',
    http_path: '/webhook/bin_number/request_number'
  },
  {
    id: 3,
    bin_id: 3,
    mongo_id: 3,
    http_method: 'DELETE',
    http_path: '/webhook/bin_number/request_number'
  },
  {
    id: 4,
    bin_id: 4,
    mongo_id: 4,
    http_method: 'GET',
    http_path: '/webhook/bin_number/request_number'
  },
]

const bin = { id: 1, bin_path: 'aabioueriow9343', created_at: '09-13-2023' }

const createBin = () => {
  // const request = axios.post(baseURL/newBin)
  // return request.then(response => response.data)
  return bin
}
const fetchMongoData = () => {
  return mongoRequestsData
}

const fetchPgData = () => {
  return pgRequestsData
}

const getPgRequests = () => {
  // const request = axios.get(baseUrl) // get from the non-webhook url?
  // return request.then(response => response.data)
  return pgRequestsData
}

const exportable = { getPgRequests, createBin, fetchMongoData, fetchPgData }

export default exportable
