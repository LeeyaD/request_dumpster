import { useState, useEffect } from "react";
import { Table } from 'react-bootstrap'
import requestService from './services/requests'

const mongoRequestsData = [
  {
    id: 1,
    requestHeaders: {
      'host': 'requestbinder.com/aabioueriow9343',
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
      'host': 'requestbinder.com/aabioueriow9343',
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
      'host': 'requestbinder.com/aabioueriow9343',
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
      'host': 'requestbinder.com/aabioueriow9343',
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
  {
    id: 5,
    requestHeaders: {
      'host': 'requestbinder.com/aabioueriow9343',
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
  {
    id: 6,
    requestHeaders: {
      'host': 'requestbinder.com/aabioueriow9343',
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
    http_path: '/webhook/aabioueriow9343'
  },
  {
    id: 2,
    bin_id: 1,
    mongo_id: 2,
    http_method: 'GET',
    http_path: '/webhook/aabioueriow9343'
  },
  {
    id: 3,
    bin_id: 1,
    mongo_id: 3,
    http_method: 'GET',
    http_path: '/webhook/aabioueriow9343'
  },
  {
    id: 4,
    bin_id: 1,
    mongo_id: 4,
    http_method: 'GET',
    http_path: '/webhook/aabioueriow9343'
  },
  {
    id: 5,
    bin_id: 1,
    mongo_id: 5,
    http_method: 'GET',
    http_path: '/webhook/aabioueriow9343'
  },
  {
    id: 6,
    bin_id: 1,
    mongo_id: 6,
    http_method: 'GET',
    http_path: '/webhook/aabioueriow9343'
  },
]

const bin = { id: 1, bin_path: 'aabioueriow9343', created_at: '09-13-2023' }

const Header = ({ bin, newBin }) => {
  return (
    <div id="header">
      <a href="/">
        <img 
          id="logo" 
          src="assets/request_inspect_logo.png" 
          alt="request inspect logo" />
        </a>
      <div id="unique-url">
        <p>Webhook URL: www.request-inspect.com/webhook/ {bin ? bin.bin_path : ""}</p>
      </div>
      <button onClick={newBin}>New Inspector</button>
    </div>
  )
}

const SideBar = ({ pRequests, handleRequestClick }) => {
  return (
    <div id="side-bar">
      <div id="sidebar-header">
        <p>HTTP Method</p>
        <p>URL Path</p>
      </div>
      <Table striped>
        <tbody>
          {pRequests.map(request =>
            <tr key={request.id}>
              <td 
                className="sidebar-items"
                onClick={() => handleRequestClick(request.mongo_id)} 
                key={request.id}>
                  <span className="http-method">{request.http_method}</span> {request.http_path}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}

const Main = ({ homePage }) => {
  if (!homePage) {
    return (
      <div id="main">
        <p>No Request Selected</p>
      </div>
    )
  }
  return (
    <div id="main">
      <h2>Webhook Request Headers</h2>
      <table>
        <tbody>
          {Object.keys(homePage).map((header, idx) =>
            <tr key={idx}>
              <td className="header-info">"{header}": "{homePage[header]}"</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [mongoRequests, setMongoRequests] = useState(mongoRequestsData)
  const [pgRequests, setPgRequests] = useState(pgRequestsData)
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
    <>
      <Header bin={bin} newBin={newBin} />
      <div id="container">
        <SideBar pRequests={pgRequests} handleRequestClick={handleRequestClick} />
        <Main homePage={homePage}/>
      </div>
    </>
  )
}

export default App;
