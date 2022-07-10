import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Nav, Navbar } from "react-bootstrap";

import { Context } from "../Context";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import LogOut from "./LogOut";

import csesocLogo from "../assets/img/csesoc_logo.png";

const Header = () => {
  const { user } = useContext(Context);

  const [signUpShow, setSignUpShow] = useState(false);
  const [logInShow, setLogInShow] = useState(false);
  const [logOutShow, setLogOutShow] = useState(false);

  const signUpOpen = () => {
    setSignUpShow(true);
  };

  const signUpClose = () => {
    setSignUpShow(false);
  };

  const logInOpen = () => {
    setLogInShow(true);
  };

  const logInClose = () => {
    setLogInShow(false);
  };

  const logOutOpen = () => {
    setLogOutShow(true);
  };

  const logOutClose = () => {
    setLogOutShow(false);
  };

  return (
    <Navbar bg="primary" variant="dark">
      <Navbar.Brand>
        <img src={csesocLogo} alt="csesoc" height={30} />
      </Navbar.Brand>
      <Nav className="mr-auto">
        <Navbar.Text className="mx-1">
          <Link to="/" style={{ color: "white" }}>
            All Projects
          </Link>
        </Navbar.Text>
        <Navbar.Text className="mx-1">
          <Link to="/projects/web" style={{ color: "white" }}>
            Web
          </Link>
        </Navbar.Text>
        <Navbar.Text className="mx-1">
          <Link to="/projects/mobile" style={{ color: "white" }}>
            Mobile
          </Link>
        </Navbar.Text>
        <Navbar.Text className="mx-1">
          <Link to="/projects/other" style={{ color: "white" }}>
            Other
          </Link>
        </Navbar.Text>
        <Navbar.Text className="mx-1">
          <Link to="/leaderboard" style={{ color: "white" }}>
            Leaderboard
          </Link>
        </Navbar.Text>
        {user !== null && (
          <Navbar.Text className="mx-1">
            <Link to="/submission" style={{ color: "white" }}>
              Submission
            </Link>
          </Navbar.Text>
        )}
        {user !== null && (
          <Navbar.Text className="mx-1">
            <Link to="/profile" style={{ color: "white" }}>
              Profile
            </Link>
          </Navbar.Text>
        )}
      </Nav>
      {user === null && (
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className="mx-2">
            <Button variant="outline-light" onClick={signUpOpen}>
              Signup
            </Button>
          </Navbar.Text>
          <Navbar.Text className="mx-2">
            <Button variant="outline-light" onClick={logInOpen}>
              Login
            </Button>
          </Navbar.Text>
          <SignUp show={signUpShow} handleClose={signUpClose} />
          <LogIn show={logInShow} handleClose={logInClose} />
        </Navbar.Collapse>
      )}
      {user !== null && (
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className="mx-2">
            Signed in as: <span style={{ color: "white" }}>{user.name}</span>
          </Navbar.Text>
          <Navbar.Text className="mx-2">
            <Button variant="danger" onClick={logOutOpen}>
              Logout
            </Button>
          </Navbar.Text>
          <LogOut show={logOutShow} handleClose={logOutClose} />
        </Navbar.Collapse>
      )}
    </Navbar>
  );
};

export default Header;
