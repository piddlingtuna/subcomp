import React, { useState } from "react";
import { Button, FormControl, InputGroup, Modal } from "react-bootstrap";

import { changeFullName } from "../calls";

const ChangeFullName = (props) => {
  const [fullName, setFullName] = useState("");

  const handleChangeFullName = () => {
    changeFullName(fullName);
    props.handleClose();
  };
  return (
    <Modal show={props.show} onHide={props.handleClose} animation={false}>
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
              setFullName(event.target.value);
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
          onClick={handleChangeFullName}
          disabled={fullName.length === 0}
        >
          Change
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeFullName;
