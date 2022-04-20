import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import AddPOI from './src/components/addPOI/AddPOI.jsx'
import Login from './src/components/auth/Login.jsx';
import Signup from './src/components/auth/Signup.jsx';
import Modal from './src/components/poiDetails/Modal.jsx';
import Placeholder from './src/components/seePOI/placeholder.jsx';
import MoreDetails from './src/components/seePOI/moreDetails.jsx';
import FindChargingStations from './src/components/findChargingStations/FindChargingStations.jsx';
import Sponsor from './src/components/sponsor/Sponsor.jsx';
import './src/styles.scss';
import axios from 'axios';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      userName: null
    }
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    axios.get('/verify')
    .then((result) => {
      if (result.data !== 'Token required for authentication') {
        this.setState({
          isLoggedIn: true,
          userName: result.data
        });
      }
    })
    .catch((err) => {
      console.error(err);
    })
  }

  logIn(user, email) {
    this.setState({
      isLoggedIn: true,
      userName: user,
      email: email
    })
  }

  logOut() {
    axios.post('/logout')
    .then((response) => {
      this.setState({
        isLoggedIn: false
      })
      console.log(response.data);
    })
    .catch((err) => {
      console.error(err);
    })
  }

  greeting() {
    if (this.state.isLoggedIn) {
      return (
        <li>
          <Link to="/logout" onClick={this.logOut}>Log Out</Link>
        </li>
      )
    } else {
      return (
        <li>
          <Link to="/login">Log In </Link> / <Link to="/signup">Sign Up</Link>
        </li>
      )
    }
  }

  render() {
    let { isLoggedIn, userName } = this.state;
    return (
      <>
        { isLoggedIn ? <h3>Welcome back, {userName} !</h3> : null }
        <BrowserRouter>
          <div className="links">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              {this.greeting()}
              <li>
                <Link to="/seePOI">seePOI</Link>
              </li>
              <li>
                <Link to="/addPOI">Add POI</Link>
              </li>
            </ul>
          </div>

          <Routes>
            <Route path="/" element={<FindChargingStations />}/>
            <Route path="/login" element={<Login logIn={this.logIn}/>} />
            <Route path="signup" element={<Signup />} />
            <Route path="/logout" element={this.state.isLoggedIn ? <Navigate to="/" replace={true} /> : null} />
            <Route path='/seePOI' element={<Placeholder />}/>
            <Route path='/moreDetails' element={<MoreDetails />}/>
            <Route path="/addPOI" element={<AddPOI />} />
            <Route path='/modal' element={<Modal />}></Route>
            <Route path='/sponsor' element={<Sponsor />}></Route>
          </Routes>
        </BrowserRouter>
      </>
    )
  }
}

const container = document.getElementById('app')
const root = createRoot(container)
root.render(<App />);
