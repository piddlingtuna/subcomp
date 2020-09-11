import React from 'react';
import { Button, FormControl, InputGroup, Modal } from 'react-bootstrap';

import { changePassword } from '../calls';

class ChangePassword extends React.Component {
  constructor() {
    super();
    this.state = {
      password: ''
    }
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  handleChangePassword() {
    changePassword(this.state.password);
    this.props.handleClose();
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            Logout
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" className="mx-2" onClick={this.props.handleClose}>
            Close
          </Button>
          <Button variant="success" className="mx-2" onClick={this.handleChangePassword} disabled={this.state.password.length < 8}>
            Change
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ChangePassword;
