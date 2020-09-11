import React from 'react';
import { Button, Modal } from 'react-bootstrap';

import { deleteProject } from '../calls';

class DeleteProject extends React.Component {
  constructor() {
    super();
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    deleteProject();
    this.props.reset();
    this.props.handleClose();
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            Delete your Project :(
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete your project? This cannot be undone.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="danger" className="mx-2" style={{ width: '75px' }} onClick={this.handleDelete}>
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

export default DeleteProject;
