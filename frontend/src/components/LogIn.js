import React, { useContext, useState } from "react";
import { Button, FormControl, InputGroup, Modal } from "react-bootstrap";

import { Context } from "../Context";
import { callLogIn, callGenerateReset } from "../calls";

const LogIn = (props) => {
  const { setUser } = useContext(Context);

  const [zid, setZid] = useState("");
  const [password, setPassword] = useState("");
  const [resetZid, setResetZid] = useState("");

  const handleLogIn = () => {
    callLogIn(zid, password)
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
    callGenerateReset(resetZid).catch((error) => {
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
          <InputGroup.Text>zid</InputGroup.Text>
          <FormControl
            type="text"
            placeholder="z1234567"
            aria-label="zid"
            onChange={(event) => {
              setZid(event.target.value);
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
          <InputGroup.Text>zid</InputGroup.Text>
          <FormControl
            type="text"
            placeholder="z1234567"
            aria-label="reset zid"
            onChange={(event) => {
              setResetZid(event.target.value);
            }}
          />
          <Button
            variant="outline-primary"
            disabled={resetZid.length !== 8}
            onClick={handleReset}
          >
            Reset
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
          disabled={zid.length !== 8 || password.length < 8}
        >
          Login
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LogIn;
