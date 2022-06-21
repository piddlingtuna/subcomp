import React from "react";
import { Button, Modal } from "react-bootstrap";

import { logOut } from "../calls";

const LogOut = (props) => {
  const handleLogOut = () => {
    logOut();
    props.handleClose();
  };

  return (
    <Modal show={props.show} onHide={props.handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Logout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to logout?</p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="danger"
            className="mx-2"
            style={{ width: "75px" }}
            onClick={handleLogOut}
          >
            Yes
          </Button>
          <Button
            variant="success"
            className="mx-2"
            style={{ width: "75px" }}
            onClick={props.handleClose}
          >
            No
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LogOut;
