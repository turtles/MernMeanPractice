import React from 'react';
import { Nav } from 'reactstrap';
import { withRouter } from 'react-router-dom';

import MainNavLink from './MainNavLink';

const MainNav = (props) => {
  const { pathname } = props.location;
  return (
    <Nav tabs>
      <MainNavLink currentRoute={pathname} route='/'>
        Home
      </MainNavLink>
      <MainNavLink currentRoute={pathname} route='/articles'>
        Articles
      </MainNavLink>
      <MainNavLink currentRoute={pathname} route='/submit'>
        Submit
      </MainNavLink>
      <MainNavLink currentRoute={pathname} route='/dashboard'>
        Dashboard
      </MainNavLink>
      <MainNavLink currentRoute={pathname} route='/preferences'>
        My Account
      </MainNavLink>
    </Nav>
  );
}

export default withRouter(MainNav);
