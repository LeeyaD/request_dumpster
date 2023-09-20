import { useState, useEffect, useRef } from "react";
import { Table } from 'react-bootstrap'
import { socket } from './socket';
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
  const navigate = useNavigate();
  const messageRef = useRef();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        messageRef.current.className = ""
        setTimeout(() => {
          messageRef.current.className = "invisible"
        }, 2500)
      })
      .catch((error) => {
        console.error('Error copying to clipboard:', error);
      });
  };

  return (
    <div id="header-container">
      <div id="header">
        <a href="/">
          <img
            id="logo"
            src="assets/request_inspect_logo.png"
            alt="request inspect logo" />
        </a>
        <Button handleClick={async () => {
          const binPath = await newBin()
          navigate(`${binPath}`)
        }} text='New Inspector' />
      </div>
        <p ref={messageRef} id="message" className="fading-element invisible">copied!</p>
        {bin ? (
          <p 
          onClick={() => copyToClipboard(`www.request-inspect.com/webhook/${bin}`)}
            id="url-container">
              {"Webhook URL: www.request-inspect.com/webhook/" + bin}
          </p>
        ) : (
          <p id="filler">Webhook URL will appear here upon bin creation</p>  
        )}
    </div>
  )
}

const SideBar = ({ pRequests, handleRequestClick }) => {
  if (!pRequests.requestData) {
    return (
      <div id="side-bar">
      <div id="sidebar-header">
        <p><strong>HTTP Method</strong></p>
        <p id="sidebar-header_path"><strong>Time of Request</strong></p>
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

  const headers = Object.keys(JSON.parse(homePage.header))
  const values = Object.values(JSON.parse(homePage.header))

  return (
    <div id="main">
      <table>
        <tbody>
          <tr key="-1">
            <td className="header-info header-title">Header</td>
            <td className="header-info header-title">Value</td>
          </tr>
          {headers.map((header, idx) =>
            <tr key={idx}>
              <td className="header-info">"{header}"</td>
              <td className="header-info">"{values[idx]}"</td>
            </tr>
          )}
        </tbody>
      </table>
      <table id="body-table">
        <tbody>
          <tr key="-1">
            <td className="header-info header-title">Body</td>
          </tr>
            <tr id="body-row">
              <td className="header-info">{homePage.body}</td>
            </tr>
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [pgRequests, setPgRequests] = useState([])
  const [homePage, setHomePage] = useState(null)
  const [bin, setBin] = useState(null)
  console.log('!!!!!! RENDER')

  useEffect(() => {
    const currentPath = window.location.pathname
    console.log(currentPath)
    const currentBinPath = currentPath.split("/")[1]
    if (currentBinPath && currentBinPath.length === 15) {
      fetchPgData(currentBinPath)
    }
  }, [])

  // need implement socket.disconnect() / reconnect for when server goes down in production
  useEffect(() => {
    socket.on('newRequest', (newRequest) => {
      let zz = {...pgRequests}
      console.log({zz})
      console.log(newRequest)
      if (zz.requestData) {
        zz.requestData.push(newRequest.requestData[0])
        setPgRequests(zz)
        console.log('$$$$$$$$$ socket set PG')
      }
    });
    return () => {
      socket.removeAllListeners()
    }
  }, [pgRequests]);

  const fetchPgData = async (currentBinPath) => {
    const pData = await requestService.fetchPgData(currentBinPath)
    console.log(pData)
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
    setHomePage(null)
    return binObj.path
  }

  return (
    <>
      <BrowserRouter>
        <Header bin={bin} newBin={newBin} pRequests={pgRequests} handleRequestClick={handleRequestClick} />
        <Routes>
            <Route path="/:bin" element={
              <>
                <div id="container">
                  <SideBar pRequests={pgRequests} handleRequestClick={handleRequestClick} />
                  <Main homePage={homePage} />
                </div>
              </>
            } />
            <Route path="/" element={
              <>
                <div id="container">
                  <SideBar pRequests={pgRequests} handleRequestClick={handleRequestClick} />
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
