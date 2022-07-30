import React, { useContext } from "react";
import { Button, Modal } from "react-bootstrap";

import { Context } from "../Context";
import { callDeleteProject } from "../calls";

const DeleteProject = (props) => {
  const { projects, setProjects, user, setUser } = useContext(Context);
  const handleDelete = () => {
    callDeleteProject()
      .then(() => {
        setProjects(
          projects.filter((project) => project.id !== user.project_id)
        );
        setUser({
          zid: user.zid,
          name: user.name,
          votes: user.votes,
          project_id: "",
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
    props.reset();
    props.handleClose();
  };

  return (
    <Modal show={props.show} onHide={props.handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Delete your Project :(</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to delete your project? This cannot be undone.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="danger"
            className="mx-2"
            style={{ width: "75px" }}
            onClick={handleDelete}
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

export default DeleteProject;
