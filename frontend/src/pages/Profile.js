import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { Button, Container, Col, Row } from "react-bootstrap";

import { Context } from "../Context";
import Header from "../components/Header";
import ProjectCard from "../components/ProjectCard";
import ChangeName from "../components/ChangeName";
import ChangePassword from "../components/ChangePassword";

const Profile = () => {
  const { projects, user } = useContext(Context);

  const [nameShow, setnameShow] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);

  const nameOpen = () => {
    setnameShow(true);
  };

  const nameClose = () => {
    setnameShow(false);
  };

  const passwordOpen = () => {
    setPasswordShow(true);
  };

  const passwordClose = () => {
    setPasswordShow(false);
  };

  return (
    <>
      {user === null ? (
        <Navigate to="/" />
      ) : (
        <>
          <Header />
          <div style={{ width: "75%", margin: "0 auto" }}>
            <h1
              className="m-3"
              style={{ display: "flex", justifyContent: "center" }}
            >
              Profile
            </h1>
            <div className="m-5">
              <Container className="m-3">
                <Row>
                  <Col>
                    <h5>zID: {user.zid}</h5>
                  </Col>
                </Row>
              </Container>
              <Container className="m-3">
                <Row>
                  <Col className="col-md-auto">
                    <h5>Full Name: {user.name}</h5>
                  </Col>
                  <Col className="col-md-auto">
                    <Button variant="warning" onClick={nameOpen}>
                      Change
                    </Button>
                    <ChangeName show={nameShow} handleClose={nameClose} />
                  </Col>
                </Row>
              </Container>
              <Button className="m-3" variant="danger" onClick={passwordOpen}>
                Change Password
              </Button>
              <ChangePassword show={passwordShow} handleClose={passwordClose} />
            </div>
            <div>
              <h5>Submission:</h5>
              <div
                className="d-flex align-content-start flex-wrap"
                style={{ display: "flex", justifyContent: "center" }}
              >
                {projects
                  .filter((project) => project.id === user.project_id)
                  .map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
              </div>
            </div>
            <div>
              <h5>Votes:</h5>
              <div
                className="d-flex align-content-start flex-wrap"
                style={{ display: "flex", justifyContent: "center" }}
              >
                {projects
                  .filter((project) => user.votes.includes(project.id))
                  .map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
