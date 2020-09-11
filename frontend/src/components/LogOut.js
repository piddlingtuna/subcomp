import React from 'react';
import { Button, Modal } from 'react-bootstrap';

import { logOut } from '../calls';

class LogOut extends React.Component {
  constructor() {
    super();
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  handleLogOut() {
    logOut();
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
            Are you sure you want to logout?
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="danger" className="mx-2" style={{ width: '75px' }} onClick={this.handleLogOut}>
              Yes
            </Button>
            <Button variant="success" className="mx-2" style={{ width: '75px' }} onClick={this.props.handleClose}>
              No
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default LogOut;
