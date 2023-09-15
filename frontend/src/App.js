import { useState } from "react";
import { Table } from 'react-bootstrap'
import {
  Routes,
  Route,
  useNavigate,
  BrowserRouter
} from 'react-router-dom'
import requestService from './services/requests'

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const Header = ({ bin, newBin }) => {
  console.log(bin)
  const navigate = useNavigate();
  return (
    <div id="header">
      <a href="/">
        <img
          id="logo"
          src="assets/request_inspect_logo.png"
          alt="request inspect logo" />
      </a>
      <div id="unique-url">
        <p>Webhook URL: www.request-inspect.com/webhook/{bin ? bin : ""}</p>
      </div>
      <Button handleClick={async () => {
        await newBin()
        navigate(`/${bin}`)
      }} text='New Inspector' />
    </div>
  )
}

const SideBar = ({ bin, pRequests, handleRequestClick }) => {
  console.log(bin)
  console.log(pRequests.requestData)
  return (
    <div id="side-bar">
      <div id="sidebar-header">
        <p><strong>HTTP Method</strong></p>
        <p id="sidebar-header_path"><strong>URL Path</strong></p>
      </div>
      <Table striped>
        <tbody>
          {pRequests.requestData.map((request, idx) =>
            <tr key={idx}>
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
          <li className="instructions">Click on a request to view its headers and body.</li>
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
          {Object.keys(homePage).map((key, idx) =>
            <tr key={idx}>
              <td className="header-info">"{key}"</td>
              <td className="header-info">"{homePage[key]}"</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // all states are 'reset' to default value on URL redirect or page refresh
  // state is only set to meaningful value on button click, which does not occur immediately on page load
  // need to have URL redirect in order to have a URL we can refresh, to get new requests to show up
      // other way would be to wait for them to pop up (some async thing?)
  const [mongoRequests, setMongoRequests] = useState([])
  const [pgRequests, setPgRequests] = useState([])
  const [homePage, setHomePage] = useState(null)
  const [bin, setBin] = useState(null)

  const handleRequestClick = (mongoID) => {
    console.log(mongoID)
    console.log(mongoRequests[0])
    setHomePage(mongoRequests[0])
  }

  // const searchMongo = (mongoID, mongoRequests) => {
  //   let singleRequest = mongoRequests.find(request => {
  //     return request.id === mongoID
  //   });
  //   console.log(singleRequest);
  //   return singleRequest.requestHeaders;
  // }

  const newBin = async () => {
    let binObj = await requestService.createBin()
    const pData = await requestService.fetchPgData(binObj.path)
    console.log(pData)
    console.log(pData.requestData[0].mongo_id)
    const mData = await requestService.fetchMongoData(binObj.path, pData.requestData[0].mongo_id)
    setBin(binObj.path)
    console.log(pData)
    setMongoRequests(mData)
    setPgRequests(pData)
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <>
              <Header bin={bin} newBin={newBin} pRequests={pgRequests} handleRequestClick={handleRequestClick} />
              <div id="container">
                <Main homePage={homePage} />
              </div>
            </>
            } />
            <Route path="/:bin_path" element={
              <>
                <Header bin={bin} newBin={newBin} pRequests={pgRequests} handleRequestClick={handleRequestClick} />
                <div id="container">
                  <SideBar bin={bin} pRequests={pgRequests} handleRequestClick={handleRequestClick} />
                  <Main homePage={homePage} />
                </div>
              </>
            } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
