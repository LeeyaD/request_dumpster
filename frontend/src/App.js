import { useState, useEffect } from "react";
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
  console.log("bin ln 21:", bin)
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
        <p>{bin ? "Webhook URL: www.request-inspect.com/webhook/" + bin : ""}</p>
      </div>
      <Button handleClick={async () => {
        const binPath = await newBin()
        navigate(`/${binPath}`)
      }} text='New Inspector' />
    </div>
  )
}

const SideBar = ({ bin, pRequests, handleRequestClick }) => {
  console.log("bin ln 43:", bin)
  console.log("pRequests.requestData ln 44:", pRequests.requestData)
  if (!pRequests.requestData) {
    return (
      <div id="side-bar">
      <div id="sidebar-header">
        <p><strong>HTTP Method</strong></p>
        <p id="sidebar-header_path"><strong>URL Path</strong></p>
      </div>
      <Table striped>
        <tbody></tbody>
      </Table>
    </div>
    )
  }
  return (
    <div id="side-bar">
      <div id="sidebar-header">
        <p><strong>HTTP Method</strong></p>
        <p id="sidebar-header_path"><strong>Time of Request</strong></p>
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
                  <span>{request.recieved_at}</span>
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
  const [pgRequests, setPgRequests] = useState([])
  const [homePage, setHomePage] = useState(null)
  const [bin, setBin] = useState(null)

  useEffect(() => {
    const currentPath = window.location.pathname
    const currentBinPath = currentPath.split("/")[1]
    if (currentBinPath && currentBinPath.length === 15) {
      fetchPgData(currentBinPath)
    }
  }, [])

  const fetchPgData = async (currentBinPath) => {
    const pData = await requestService.fetchPgData(currentBinPath)
    setBin(currentBinPath)
    setPgRequests(pData)
  }

  const handleRequestClick = async (mongoId) => {
    const currentPath = window.location.pathname
    const currentBinPath = currentPath.split("/")[1]
    const mData = await requestService.fetchMongoData(currentBinPath, mongoId)
    setHomePage(mData[0])
  }

  const newBin = async () => {
    let binObj = await requestService.createBin()
    fetchPgData(binObj.path)
    return binObj.path
  }

  return (
    <>
      <BrowserRouter>
        <Header bin={bin} newBin={newBin} pRequests={pgRequests} handleRequestClick={handleRequestClick} />
        <Routes>
          <Route path="/" element={
            <>
              <div id="container">
                <SideBar bin={""} pRequests={pgRequests} handleRequestClick={handleRequestClick} />
                <Main homePage={homePage} />
              </div>
            </>
            } />
            <Route path="/:bin_path" element={
              <>
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
