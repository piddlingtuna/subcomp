import React, { useState } from "react";
import Truncate from "react-truncate";
import { Card, Container, Col, Row } from "react-bootstrap";

import ProjectModal from "./ProjectModal";

const ProjectCard = () => {
  const [show, setShow] = useState(false);
  const handleOpen = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <ProjectModal
        project={props.project}
        disabled={props.disabled}
        show={show}
        handleClose={handleClose}
      />
      <Card className="m-3" style={{ width: "20rem", height: "16rem" }}>
        <Card.Body onClick={handleOpen} style={{ cursor: "pointer" }}>
          <Card.Title>
            <Truncate lines={1} width={250}>
              <h3>{props.project.title}</h3>
            </Truncate>
          </Card.Title>
          <Truncate lines={2} width={250}>
            Team: {props.project.team.join(", ")}
          </Truncate>
          <br />
          <Truncate lines={4} width={250}>
            {props.project.summary}
          </Truncate>
        </Card.Body>
        <Card.Footer background="white">
          <Container style={{ height: "25px" }}>
            <Row>
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
            </Row>
          </Container>
        </Card.Footer>
      </Card>
    </>
  );
};

export default ProjectCard;
