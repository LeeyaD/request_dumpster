import { useState, useEffect } from "react";
import { Table } from 'react-bootstrap'
import requestService from './services/requests'

// const mongoRequestsData = [
//   {
//     id: 1,
//     requestHeaders: {
//       'host': 'requestbinder.com/1111',
//       'content-length': '97',
//       'accept': 'applic... */*',
//       'sec-fetch-site': 'same-origin',
//       'accept-language': 'en-GB,en;q=0.9',
//       'accept-encoding': 'gzip, deflate, br',
//       'sec-fetch-mode': 'cors',
//       'content-type': 'application/json',
//       'origin': 'https:....com',
//       'user-agent': 'Mozill...1.15',
//       'referer': 'https:...eea1',
//       'sec-fetch-dest': 'empty',
//     }
//   },
//   {
//     id: 2,
//     requestHeaders: {
//       'host': 'requestbinder.com/2222',
//       'content-length': '97',
//       'accept': 'applic... */*',
//       'sec-fetch-site': 'same-origin',
//       'accept-language': 'en-GB,en;q=0.9',
//       'accept-encoding': 'gzip, deflate, br',
//       'sec-fetch-mode': 'cors',
//       'content-type': 'application/json',
//       'origin': 'https:....com',
//       'user-agent': 'Mozill...1.15',
//       'referer': 'https:...eea1',
//       'sec-fetch-dest': 'empty',
//     }
//   },
//   {
//     id: 3,
//     requestHeaders: {
//       'host': 'requestbinder.com/3333',
//       'content-length': '97',
//       'accept': 'applic... */*',
//       'sec-fetch-site': 'same-origin',
//       'accept-language': 'en-GB,en;q=0.9',
//       'accept-encoding': 'gzip, deflate, br',
//       'sec-fetch-mode': 'cors',
//       'content-type': 'application/json',
//       'origin': 'https:....com',
//       'user-agent': 'Mozill...1.15',
//       'referer': 'https:...eea1',
//       'sec-fetch-dest': 'empty',
//     }
//   },
//   {
//     id: 4,
//     requestHeaders: {
//       'host': 'requestbinder.com/4444',
//       'content-length': '97',
//       'accept': 'applic... */*',
//       'sec-fetch-site': 'same-origin',
//       'accept-language': 'en-GB,en;q=0.9',
//       'accept-encoding': 'gzip, deflate, br',
//       'sec-fetch-mode': 'cors',
//       'content-type': 'application/json',
//       'origin': 'https:....com',
//       'user-agent': 'Mozill...1.15',
//       'referer': 'https:...eea1',
//       'sec-fetch-dest': 'empty'
//     }
//   },
// ]

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
//     http_method: 'GET',
//     http_path: '/webhook/bin_number/request_number'
//   },
//   {
//     id: 3,
//     bin_id: 3,
//     mongo_id: 3,
//     http_method: 'GET',
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

const Header = ({ bin, newBin }) => {
  return (
    <div>
      <h1>Request Inspector</h1>
      <p>Webhook: www.request-inspect.com/webhook/{bin ? bin.bin_path : ""}</p>
      <button onClick={newBin}>Create New Inspector</button>
    </div>
  )
}

const SideBar = ({ pRequests, handleRequestClick }) => {
  return (
    <>
      <Table striped>
        <tbody>
          {pRequests.map(request =>
            <tr key={request.id}>
              <td>
                <p onClick={() => handleRequestClick(request.mongo_id)} key={request.id}>{request.http_method}{request.http_path}</p>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  )
}

const Main = ({ homePage }) => {
  if (!homePage) {
    return (
      <div>
        <p>Main</p>
      </div>
    )
  }
  return (
    <>
      <table>
        <tbody>
          {Object.keys(homePage).map((header, idx) =>
            <tr key={idx}>
              <td>"{header}": "{homePage[header]}"</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

const App = () => {
  const [mongoRequests, setMongoRequests] = useState([])
  const [pgRequests, setPgRequests] = useState([])
  const [homePage, setHomePage] = useState(null)
  const [bin, setBin] = useState([])

  const handleRequestClick = (mongoID) => {
    console.log(mongoID)
    let requestData = searchMongo(mongoID, mongoRequests)
    setHomePage(requestData)
  }

  const searchMongo = (mongoID, mongoRequests) => {
    console.log(mongoRequests);
    let singleRequest = mongoRequests.find(request => {
      return request.id === mongoID
    });
    console.log(singleRequest.requestHeaders);
    return singleRequest.requestHeaders;
  }

  const newBin = async () => {
    let newBin = await requestService.createBin()
    setBin(newBin)
  }

  return (
    <div>
      <Header bin={bin} newBin={newBin} />
      <SideBar pRequests={pgRequests} handleRequestClick={handleRequestClick} />
      <Main homePage={homePage}/>
    </div>
  )
}

export default App;

// useEffect(() => {
//   contactService
//     .getAll().then(response => {
//       setPersons(response)
//       setFiltered(response)
//     })
//     .catch(error => {
//       alert(`${error}`)
//       return []
//     })
// }, [])