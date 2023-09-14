import { useState } from "react";
import { Table } from 'react-bootstrap'
import requestService from './services/requests'

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
        <p>Webhook URL: www.request-inspect.com/webhook/{bin ? bin.bin_path : ""}</p>
      </div>
      <button onClick={newBin}>New Inspector</button>
    </div>
  )
}

const SideBar = ({ pRequests, handleRequestClick }) => {
  return (
    <div id="side-bar">
      <div id="sidebar-header">
        <p><strong>HTTP Method</strong></p>
        <p id="sidebar-header_path"><strong>URL Path</strong></p>
      </div>
      <Table striped>
        <tbody>
          {pRequests.map(request =>
            <tr key={request.id}>
              <td 
                className="sidebar-items"
                onClick={() => handleRequestClick(request.mongo_id)} 
                key={request.id}>
                <div className="sidebar-container">
                  <span className="http-method">{request.http_method}</span>
                  <span>{request.http_path}</span>
                </div>

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
        <h3>Getting Started</h3>
        <ul>
          <li className="instructions">Click "New Inspector" to create a bin.</li>
          <li className="instructions">Use "Webhook URL" as the endpoint for a webhook provider.</li>
          <li className="instructions">Watch webhook requests come into the sidebar.</li>
          <li className="instructions">Click on a request to view it's headers and body.</li>
        </ul>
      </div>
    )
  }
  return (
    <div id="main">
      <table>
        <tbody>
        <tr key="-1">
              <td className="header-info header-title">Header</td> 
              <td className="header-info header-title">Value</td>
            </tr>
          {Object.keys(homePage).map((header, idx) =>
            <tr key={idx}>
              <td className="header-info">"{header}"</td> 
              <td className="header-info">"{homePage[header]}"</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [mongoRequests, setMongoRequests] = useState([])
  const [pgRequests, setPgRequests] = useState([])
  const [homePage, setHomePage] = useState(null)
  const [bin, setBin] = useState(null)

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
    const mData = requestService.fetchMongoData(newBin)
    const pData = requestService.fetchPgData()
    setBin(newBin)
    setMongoRequests(mData)
    setPgRequests(pData)
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
