import React, { Component } from "react";
import Truncate from "react-truncate";
import { Button, Container, Col, Row, Modal } from "react-bootstrap";

import { vote, unvote } from "../calls";

const ProjectModal = (props) => {
  const { user } = useContext(Context);

  return (
    <Modal
      size="lg"
      show={props.show}
      onHide={props.handleClose}
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <Truncate lines={1} width={750}>
            <h3>{props.project.title}</h3>
          </Truncate>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ wordWrap: "break-word" }}>
        Team: {props.project.team.join(", ")}
        <br />
        {props.project.summary}
      </Modal.Body>
      <Modal.Footer>
        <Container>
          <Row className="align-items-center">
            <Col>
              <a
                href={props.project.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Link
              </a>
            </Col>
            <Col>
              <a
                href={props.project.repo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Repo
              </a>
            </Col>
            <Col>
              {props.project.votes}{" "}
              {props.project.votes === 1 ? "vote" : "votes"}
            </Col>
            {user != null && !user.votes.includes(props.project.id) && (
              <Button
                variant="success"
                style={{ width: "150px" }}
                disabled={props.disabled || user.votes.length >= 3}
                onClick={() => vote(props.project.id)}
              >
                Vote for project!
              </Button>
            )}
            {user != null && user.votes.includes(props.project.id) && (
              <Button
                variant="danger"
                style={{ width: "150px" }}
                disabled={props.disabled}
                onClick={() => unvote(props.project.id)}
              >
                Unvote project
              </Button>
            )}
          </Row>
        </Container>
      </Modal.Footer>
    </Modal>
  );
};

export default ProjectModal;
