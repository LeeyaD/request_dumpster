// import {useState} from "react";

const requests = [
  {
    id: 1,
    requestHeaders: {
      'host': 'requestbinder.com',
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
      'host': 'requestbinder.com',
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
      'host': 'requestbinder.com',
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
      'host': 'requestbinder.com',
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
    http_path: '/webhook/bin_number/request_number'
  },
  {
    id: 2,
    bin_id: 2,
    mongo_id: 1,
    http_method: 'GET',
    http_path: '/webhook/bin_number/request_number'
  },
  {
    id: 3,
    bin_id: 3,
    mongo_id: 1,
    http_method: 'GET',
    http_path: '/webhook/bin_number/request_number'
  },
  {
    id: 4,
    bin_id: 4,
    mongo_id: 1,
    http_method: 'GET',
    http_path: '/webhook/bin_number/request_number'
  },
]

const bin = { id: 1, bin_path: 'aabioueriow9343', created_at: '09-13-2023' }

const Header = ({ bin }) => {
  return (
    <div>
      <h1>Request Inspector</h1>
      <p>Webhook: www.request-inspect.com/webhook/{bin.bin_path}</p>
      <button>Create New Inspector</button>
    </div>
  )
}

const SideBar = ({ requests }) => {
  return (
    <>
      <tbody>
        {requests.map(request =>
          <>
            <tr key={request.id}>
              <td>
                {request.http_method}{request.http_path}
              </td>
            </tr>
          </>
        )}
      </tbody>
    </>
  )
}

const Main = () => {
  return (
    <div>
      <p>Main</p>
    </div>
  )
}

const App = () => {
  return (
    <div>
      <Header bin={bin} />
      <SideBar requests={pgRequestsData} />
      <Main />
    </div>
  )
}

export default App;

// import { Table } from 'react-bootstrap'

// return (
//   <>
//     <tbody>
//       {requests.map(request =>
//         <>
//           <tr key={request.id}>
//             <td>
//               // { <Link to={`/contacts/${contact.id}`}>
//               //  {contact.name} {' '} {contact.number} {' '}
//               </Link> }*/
//             </td>
//           </tr>
//         </>
//       )}
//     </tbody>
//   </>
// )
