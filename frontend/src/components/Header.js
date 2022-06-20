import React from 'react';
import { Link } from 'react-router-dom';
import { CSComponent } from 'react-central-state';
import { Button, Nav, Navbar } from 'react-bootstrap';

import csesocLogo from '../assets/img/csesoc_logo.png';
import SignUp from './SignUp';
import LogIn from './LogIn';
import LogOut from './LogOut';

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      signUpShow: false,
      logInShow: false,
      logOutShow: false,
    };
    this.signUpOpen = this.signUpOpen.bind(this);
    this.signUpClose = this.signUpClose.bind(this);
    this.logInOpen = this.logInOpen.bind(this);
    this.logInClose = this.logInClose.bind(this);
    this.logOutOpen = this.logOutOpen.bind(this);
    this.logOutClose = this.logOutClose.bind(this);
  }

  signUpOpen() {
    this.setState({
      signUpShow: true,
    });
  }

  signUpClose() {
    this.setState({
      signUpShow: false,
    });
  }

  logInOpen() {
    this.setState({
      logInShow: true,
    });
  }

  logInClose() {
    this.setState({
      logInShow: false,
    });
  }

  logOutOpen() {
    this.setState({
      logOutShow: true,
    });
  }

  logOutClose() {
    this.setState({
      logOutShow: false,
    });
  }

  updateWith() {
    return ['user'];
  }

  render() {
    return (
      <Navbar bg="primary" variant="dark">
        <Navbar.Brand>
          <img src={csesocLogo} alt="csesoc" height={30} />
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Navbar.Text className="mx-1">
            <Link to="" style={{ color: 'white' }}>
              Projects
            </Link>
          </Navbar.Text>
          <Navbar.Text className="mx-1">
            <Link to="leaderboard" style={{ color: 'white' }}>
              Leaderboard
            </Link>
          </Navbar.Text>
          {this.centralState.user !== null && (
            <Navbar.Text className="mx-1">
              <Link to="submission" style={{ color: 'white' }}>
                Submission
              </Link>
            </Navbar.Text>
          )}
          {this.centralState.user !== null && (
            <Navbar.Text className="mx-1">
              <Link to="profile" style={{ color: 'white' }}>
                Profile
              </Link>
            </Navbar.Text>
          )}
        </Nav>
        {this.centralState.user === null && (
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="mx-2">
              <Button variant="outline-light" onClick={this.signUpOpen}>
                Signup
              </Button>
            </Navbar.Text>
            <Navbar.Text className="mx-2">
              <Button variant="outline-light" onClick={this.logInOpen}>
                Login
              </Button>
            </Navbar.Text>
            <SignUp
              show={this.state.signUpShow}
              handleClose={this.signUpClose}
            />
            <LogIn show={this.state.logInShow} handleClose={this.logInClose} />
          </Navbar.Collapse>
        )}
        {this.centralState.user !== null && (
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="mx-2">
              Signed in as:{' '}
              <span style={{ color: 'white' }}>
                {this.centralState.user.fullName}
              </span>
            </Navbar.Text>
            <Navbar.Text className="mx-2">
              <Button variant="danger" onClick={this.logOutOpen}>
                Logout
              </Button>
            </Navbar.Text>
            <LogOut
              show={this.state.logOutShow}
              handleClose={this.logOutClose}
            />
          </Navbar.Collapse>
        )}
      </Navbar>
    );
  }
}

export default CSComponent(Header);
