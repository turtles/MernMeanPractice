import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import {
    Row,
    Nav, Navbar, NavbarBrand
} from 'reactstrap';

import HeaderLogo from './HeaderLogo';
import LoginUnit from './LoginUnit';
import MainNav from './Navigation/MainNav';
import ActivateAccountHeader from './ActivateAccountHeader';

import query from '../../graphql/queries/CurrentUser';
import mutation from '../../graphql/mutations/LogoutUser';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {user: null};
    this.renderLogin.bind(this);
    this.onLogout.bind(this);
  }

  onLogout() {
    this.props.mutate({
      refetchQueries: [{ query }]
    });
  }

  renderLogin() {
    const { loading, user } = this.props.data;
    if (loading) return (<Nav/>);
    return (
      <LoginUnit
        user={user}
        onLogout={()=>this.onLogout()}
        />
    );
  }

  render() {
    const { user } = this.props.data;
    return (
      <div>
        <ActivateAccountHeader user={user} />
        <Navbar>
          <NavbarBrand tag={Link} to={'/'}>
            <HeaderLogo/>
          </NavbarBrand>
          {this.renderLogin()}
        </Navbar>
        <Row>
          <MainNav user={user} />
        </Row>
      </div>
    )
  }
}

export default graphql(mutation)(
  graphql(query)(Header)
);
