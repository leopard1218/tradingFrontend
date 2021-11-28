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
const App = props => <Router />

export default App
