import React, { useState } from "react";
import { Button, FormControl, InputGroup, Modal } from "react-bootstrap";

import { callChangePassword } from "../calls";

const ChangePassword = (props) => {
  const [password, setPassword] = useState("");

  const handleChangePassword = () => {
    callChangePassword(password).catch((error) => {
      alert(error.response.data.message);
    });
    props.handleClose();
  };

  return (
    <Modal show={props.show} onHide={props.handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Logout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Your password must be at least 8 characters long.</p>
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" className="mx-2" onClick={props.handleClose}>
          Close
        </Button>
        <Button
          variant="success"
          className="mx-2"
          onClick={handleChangePassword}
          disabled={password.length < 8}
        >
          Change
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePassword;
