import React, { Component } from 'react';
import UserLogin from './../components/user/UserLogin.js';
import {Container} from 'reactstrap';

class LoginPage extends Component {
  render() {
    return (
      <Container>
        <UserLogin/>
      </Container>
    );
  }
}

export default LoginPage;
