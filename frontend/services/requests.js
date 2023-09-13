import axios from 'axios'
// const baseUrl = '/api/contacts'

const getRequests = () => {
  const request = axios.get(baseUrl) // get from the non-webhook url?
  return request.then(response => response.data)
}

const exportable = { getRequests }

export default exportable
