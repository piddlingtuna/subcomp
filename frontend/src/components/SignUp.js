import React from 'react';
import { Button,  FormControl, InputGroup, Modal } from 'react-bootstrap';

import { generateVerification } from '../calls';

class SignUp extends React.Component {
  constructor() {
    super();
    this.state = {
      zID: '',
      fullName: '',
      password: '',
    }
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleSignUp() {
    generateVerification(this.state.zID, this.state.fullName, this.state.password);
    this.props.handleClose();
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            Signup
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
              aria-label="zid"
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
                Full Name
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              type="text"
              placeholder="Jashank Shepherd"
              aria-label="full name"
              onChange={event => {
                  this.setState({
                    fullName: event.target.value,
                  })
                }}
            />
          </InputGroup>
          <p>
            Your password must be at least 8 characters long.
          </p>
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
            An email will be sent to {this.state.zID}@unsw.edu.au to verify your account.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" className="mx-2" onClick={this.props.handleClose}>
            Close
          </Button>
          <Button variant="success" className="mx-2" onClick={this.handleSignUp} disabled={this.state.zID.length !== 8 || this.state.fullName.length === 0 || this.state.password.length < 8}>
            Signup
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default SignUp;
