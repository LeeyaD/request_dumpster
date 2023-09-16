import axios from 'axios'

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
  console.log("response.data ln 22 requests:", response.data)
  return response.data
}

// fetch PG Requests row that matches current bin path (should contain the auto ping on new bin creation)
const fetchPgData = async (binPath) => {
  const response = await axios.get(`http://localhost:3001/${binPath}`)
  console.log("response.data ln 29 requests:", response.data)
  return response.data
}

const exportable = { createBin, fetchMongoData, fetchPgData }

export default exportable
