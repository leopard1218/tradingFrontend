// ** Router Import
import Router from './router/Router'
import jwt_decode from 'jwt-decode'
import setAuthToken from './utils/setAuthToken'

if (localStorage.getItem('jwtToken')) {
  setAuthToken(localStorage.getItem('jwtToken'))
  const userDecoded = jwt_decode(localStorage.getItem('jwtToken'))
  // store.dispatch(setCurrentUser(userDecoded));
  // Check for expired time
  const currentTime = Date.now() / 1000
  if (userDecoded.exp < currentTime) {
    // Logout
    // store.dispatch(logoutUser());
    // // User
    // store.dispatch(setCurrentUser({}));
    localStorage.removeItem('jwtToken')
    window.location.href = "/"
  }

}

// import Affiliate from 'affiliate' // window.Affiliate is automatically accessible if using a CDN

// const aff = Affiliate.create({
//   log: true, // enable logging
//   tags: [
//     {
//       hosts: ['fynance.capital', 'www.fynance.capital'], // a list of applicable hosts
//       query: {
//         ref: 'my-tag' // will output a url with ?ref=my-tag
//       }
//       // modify: (url) => {
//       //   // a function that directly modifies the URL
//       //   url.set(`pathname ${url.pathname }-tag`)
//       //   url.set(`hostname${url.hostname}.rdr.fynance.capital`)
//       //   return url
//       // }
//     }
//   ]
// })

// aff.attach()
const App = props => <Router />

export default App
