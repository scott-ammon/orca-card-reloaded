import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import LoginContainer from './LoginContainer';
import SignupContainer from './SignupContainer';
import { UserProfile } from './UserProfile';
import {BrowserRouter as Router, Route} from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: '',
      user: null,
      lockedResult: ''
    }
    this.checkForLocalToken = this.checkForLocalToken.bind(this);
    this.logout = this.logout.bind(this);
    this.liftTokenToState = this.liftTokenToState.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  liftTokenToState(data) {
    this.setState({
      token: data.token,
      user: data.user
    })
  }

  handleClick(e) {
    e.preventDefault();
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.token}`;
    axios.get('/locked/test').then( results => {
      this.setState({
        lockedResult: results.data
      })
    })
  }

  logout() {
    // remove token from local storage
    localStorage.removeItem('mernToken');
    // remove info from state
    this.setState({
      token: '',
      user: null
    })
  }

  checkForLocalToken() {
    //Look for token in local storage
    let token = localStorage.getItem('mernToken');
    if (!token) {
      // There was no token
      // remove mernToken from local storage just in case corrupted, replaced etc
      localStorage.removeItem('mernToken')
      this.setState({
        token: '',
        user: null
      })
    } else {
      // token found in local storage
      // send it to the back to be verified
      axios.post('/auth/me/from/token', {
        token
      }).then( results => {
        // put the token in local storage
        localStorage.setItem('mernToken', results.data.token);
        this.setState({
          token: results.data.token,
          user: results.data.user
        })
      }).catch( err => console.log(err))
    }
  }

  componentDidMount() {
    this.checkForLocalToken();
  }

  render() {
    return(
      <Router>
        <div className="App">
          <Route exact path="/signup" component = {() => <SignupContainer liftToken={this.liftTokenToState} />} />
          <Route exact path="/login" component = {() => <LoginContainer liftToken={this.liftTokenToState} />} />
        </div>
      </Router>
    )
  }
}

export default App;
