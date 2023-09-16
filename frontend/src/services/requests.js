import axios from 'axios'

const createBin = async () => {
  const response1 = await axios.post('http://localhost:3001/new_bin')
  const bin = response1.data.path

  await axios({
    method: 'post',
    url: `http://localhost:3001/webhook/${bin}`,
    data: {
      message: "this is a test request automatically sent when you create a bin"
    }
  });

  return response1.data
}

const fetchMongoData = async (bin_path, mongo_id) => {
  const response = await axios.get(`http://localhost:3001/${bin_path}/${mongo_id}`)
  return response.data
}

const fetchPgData = async (binPath) => {
  const response = await axios.get(`http://localhost:3001/${binPath}`)
  return response.data
}

const exportable = { createBin, fetchMongoData, fetchPgData }

export default exportable
