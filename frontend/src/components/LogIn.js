import React, { useState } from 'react';
import { Button,  FormControl, InputGroup, Modal } from 'react-bootstrap';

import { logIn, generateReset } from '../calls';

const LogIn = (props) => {
  const [state, setState] = useState({
    zID: '',
    password: '',
    resetZID: '',
  });

  const handleLogIn =() => {
    logIn(state.zID, state.password);
    props.handleClose();
  }

      const handleReset =() => {
        generateReset(state.resetZID);
        props.handleClose()
      }

  return (
      <Modal show={props.show} onHide={props.handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            Login
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <InputGroup className="mb-3">
              <InputGroup.Text>
                zID
              </InputGroup.Text>
            <FormControl
              type="text"
              placeholder="z1234567"
              aria-label="zID"
              onChange={event => {
                setState({
                  zID: event.target.value,
                })
              }}
            />
          </InputGroup>
          <InputGroup className="mb-3">
              <InputGroup.Text>
                Password
              </InputGroup.Text>
            <FormControl
              type="password"
              placeholder="*******"
              aria-label="password"
              onChange={event => {
                setState({
                  password: event.target.value,
                })
              }}
            />
          </InputGroup>
          <p>
            Did you forget your password?
          </p>
          <InputGroup className="mb-3">
              <InputGroup.Text>
                zID
              </InputGroup.Text>
            <FormControl
              type="text"
              placeholder="z1234567"
              aria-label="reset zID"
              onChange={event => {
                setState({
                  resetZID: event.target.value,
                })
              }}
            />
              <Button variant="outline-primary" disabled={state.resetZID.length !== 8} onClick={handleReset}>
                reset
              </Button>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" className="mx-2" onClick={props.handleClose}>
            Close
          </Button>
          <Button variant="success" className="mx-2" onClick={handleLogIn} disabled={state.zID.length !== 8 || state.password.length < 8}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

export default LogIn;
