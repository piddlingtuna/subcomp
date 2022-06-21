import React, { useContext, useState } from "react";
import { Button, FormControl, InputGroup, Modal } from "react-bootstrap";

import { Context } from "../Context";
import { callLogIn, callGenerateReset } from "../calls";

const LogIn = (props) => {
  const { setUser } = useContext(Context);

  const [zID, setZID] = useState("");
  const [password, setPassword] = useState("");
  const [resetZID, setResetZID] = useState("");

  const handleLogIn = () => {
    callLogIn(zID, password)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
    props.handleClose();
  };

  const handleReset = () => {
    callGenerateReset(resetZID).catch((error) => {
      alert(error.response.data.message);
    });
    props.handleClose();
  };

  return (
    <Modal show={props.show} onHide={props.handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text>zID</InputGroup.Text>
          <FormControl
            type="text"
            placeholder="z1234567"
            aria-label="zID"
            onChange={(event) => {
              setZID(event.target.value);
            }}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Password</InputGroup.Text>
          <FormControl
            type="password"
            placeholder="*******"
            aria-label="password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </InputGroup>
        <p>Did you forget your password?</p>
        <InputGroup className="mb-3">
          <InputGroup.Text>zID</InputGroup.Text>
          <FormControl
            type="text"
            placeholder="z1234567"
            aria-label="reset zID"
            onChange={(event) => {
              setResetZID(event.target.value);
            }}
          />
          <Button
            variant="outline-primary"
            disabled={resetZID.length !== 8}
            onClick={handleReset}
          >
            reset
          </Button>
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" className="mx-2" onClick={props.handleClose}>
          Close
        </Button>
        <Button
          variant="success"
          className="mx-2"
          onClick={handleLogIn}
          disabled={zID.length !== 8 || password.length < 8}
        >
          Login
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LogIn;
