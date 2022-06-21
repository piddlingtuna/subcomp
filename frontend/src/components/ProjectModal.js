import React, { useContext } from "react";
import Truncate from "react-truncate";
import { Button, Container, Col, Row, Modal } from "react-bootstrap";

import { Context } from "../Context";
import { callVote, callUnvote } from "../calls";

const ProjectModal = (props) => {
  const { projects, setProjects, user, setUser } = useContext(Context);

  const vote = () => {
    callVote(props.projectId)
      .then(() => {
        const project = projects.filter(
          (project) => project.id === props.project.id
        )[0];
        project.votes++;
        setProjects(
          projects
            .filter((project) => project.id !== props.project.id)
            .concat(project)
            .sort((a, b) => a.id > b.id)
        );
        setUser({
          zID: user.zID,
          fullName: user.fullName,
          votes: user.votes.concat(props.project.id),
          projectId: user.projectId,
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  const unvote = () => {
    callUnvote(props.projectID)
      .then(() => {
        const project = projects.filter(
          (project) => project.id === props.project.id
        )[0];
        project.votes--;
        setProjects(
          projects
            .filter((project) => project.id !== props.project.id)
            .concat(project)
            .sort((a, b) => a.id > b.id)
        );
        setUser({
          zID: user.zID,
          fullName: user.fullName,
          votes: user.votes.filter((id) => id !== props.project.id),
          projectId: user.projectId,
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

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
