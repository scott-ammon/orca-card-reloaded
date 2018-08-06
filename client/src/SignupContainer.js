import React, {Component} from 'react';
import Signup from './Signup';
import axios from 'axios';

class Signup extends Component {
    constructor(props){
      super(props)
      this.state = {
        name: '',
        email: '',
        password: ''
      }
      this.handleNameChange = this.handleNameChange.bind(this);
      this.handleEmailChange = this.handleEmailChange.bind(this);
      this.handlePasswordChange = this.handlePasswordChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      }

handleNameChange(e) {
  this.setState({
    name: e.target.value
  })
}

handleEmailChange(e) {
  this.setState ({
    email: e.target.value
  })
}

handlePasswordChange(e) {
  this.setState ({
    password: e.target.value
  })
}

handleSubmit(e) {
  e.preventDefault();
  axios.post('/auth/signup', {
    name: this.state.name,
    email: this.state.email,
    password: this.state.password
  }).then( result => {
    localStorage.setItem('mernToken', result.data.token)
    this.props.liftToken(result.data)
  }).catch( err => console.log(err) )
}

render() {
  return (
    <Signup handleInputChange={() => this.handleInputChange}
            name={this.state.name}
            email={this.state.email}
            password={this.state.password}
    />
  )
}
}

export default SignupContainer;
