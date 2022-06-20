import React from 'react';
import { Button, FormControl, InputGroup, Modal } from 'react-bootstrap';

import { changeFullName } from '../calls';

class ChangeFullName extends React.Component {
  constructor() {
    super();
    this.state = {
      fullName: '',
    };
    this.handleChangeFullName = this.handleChangeFullName.bind(this);
  }

  handleChangeFullName() {
    changeFullName(this.state.fullName);
    this.props.handleClose();
  }

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.handleClose}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Full Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text>Full Name</InputGroup.Text>
            <FormControl
              type="text"
              placeholder="John Jeremy"
              aria-label="full name"
              onChange={(event) => {
                this.setState({
                  fullName: event.target.value,
                });
              }}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            className="mx-2"
            onClick={this.props.handleClose}
          >
            Close
          </Button>
          <Button
            variant="success"
            className="mx-2"
            onClick={this.handleChangeFullName}
            disabled={this.state.fullName.length === 0}
          >
            Change
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ChangeFullName;
