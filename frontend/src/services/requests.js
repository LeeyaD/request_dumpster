import axios from 'axios'

const createBin = async () => {
  const binResponse = await axios.post('/new_bin')
  const bin = binResponse.data
  console.log(bin)

  const requestResponse = await axios.post(`/${bin}`)
  const binner = requestResponse.data.path
  console.log(binner)

  await axios({
    method: 'post',
    url: `/webhook/${binner}`,
    data: {
      message: "this is a test request automatically sent when you create a bin"
    }
  });

  console.log(requestResponse.data)
  return requestResponse.data
}

const fetchMongoData = async (bin_path, mongo_id) => {
  const response = await axios.get(`/${bin_path}/${mongo_id}`)
  return response.data
}

const fetchPgData = async (binPath) => {
  const response = await axios.post(`/${binPath}`)
  return response.data
}

const exportable = { createBin, fetchMongoData, fetchPgData }

export default exportable
