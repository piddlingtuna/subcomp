import React from 'react';
import { Button,  FormControl, InputGroup, Modal } from 'react-bootstrap';

import { logIn, generateReset } from '../calls';

class LogIn extends React.Component {
  constructor() {
    super();
    this.state = {
      zID: '',
      password: '',
      resetZID: '',
    }
    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleLogIn() {
    logIn(this.state.zID, this.state.password);
    this.props.handleClose();
  }

  handleReset() {
    generateReset(this.state.resetZID);
    this.props.handleClose();
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            Login
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>
                zID
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              type="text"
              placeholder="z1234567"
              aria-label="zID"
              onChange={event => {
                this.setState({
                  zID: event.target.value,
                })
              }}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>
                Password
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              type="password"
              placeholder="*******"
              aria-label="password"
              onChange={event => {
                this.setState({
                  password: event.target.value,
                })
              }}
            />
          </InputGroup>
          <p>
            Did you forget your password?
          </p>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>
                zID
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              type="text"
              placeholder="z1234567"
              aria-label="reset zID"
              onChange={event => {
                this.setState({
                  resetZID: event.target.value,
                })
              }}
            />
            <InputGroup.Prepend>
              <Button variant="outline-primary" disabled={this.state.resetZID.length !== 8} onClick={this.handleReset}>
                reset
              </Button>
            </InputGroup.Prepend>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" className="mx-2" onClick={this.props.handleClose}>
            Close
          </Button>
          <Button variant="success" className="mx-2" onClick={this.handleLogIn} disabled={this.state.zID.length !== 8 || this.state.password.length < 8}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default LogIn;
