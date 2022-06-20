import React from 'react';
import { Navigate } from 'react-router-dom';
import { CSComponent } from 'react-central-state';
import { Button, Container, Col, Row } from 'react-bootstrap';

import Header from '../components/Header';
import ProjectCard from '../components/ProjectCard';
import ChangeFullName from '../components/ChangeFullName';
import ChangePassword from '../components/ChangePassword';

class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      fullNameShow: false,
      passwordShow: false,
    }
    this.fullNameOpen = this.fullNameOpen.bind(this);
    this.fullNameClose = this.fullNameClose.bind(this);
    this.passwordOpen = this.passwordOpen.bind(this);
    this.passwordClose = this.passwordClose.bind(this);
  }

  fullNameOpen() {
    this.setState({
      fullNameShow: true,
    });
  }

  fullNameClose() {
    this.setState({
      fullNameShow: false,
    });
  }

  passwordOpen() {
    this.setState({
      passwordShow: true,
    });
  }

  passwordClose() {
    this.setState({
      passwordShow: false,
    });
  }

  updateWith() {
    return ['projects', 'user'];
  }

  render() {
    return (
      <>
       {
         this.centralState.user === null ? <Navigate to="" /> :
         <>
          <Header />
          <div style={{ width: '75%', margin: '0 auto' }}>
            <h1 className="m-3" style={{ display: 'flex', justifyContent: 'center' }}>
              Profile
            </h1>
            <div className="m-5">
              <Container className="m-3">
                <Row>
                  <Col>
                    <h5>
                      zID: {this.centralState.user.zID}
                    </h5>
                  </Col>
                </Row>
              </Container>
              <Container className="m-3">
                <Row>
                  <Col className="col-md-auto">
                  <h5>
                    Full Name: {this.centralState.user.fullName}
                  </h5>
                  </Col>
                  <Col className="col-md-auto">
                    <Button variant="warning" onClick={this.fullNameOpen}>
                      Change
                    </Button>
                    <ChangeFullName show={this.state.fullNameShow} handleClose={this.fullNameClose}/>
                  </Col>
                </Row>
              </Container>
              <Button className="m-3" variant="danger" onClick={this.passwordOpen}>
                Change Password
              </Button>
              <ChangePassword show={this.state.passwordShow} handleClose={this.passwordClose}/>
            </div>
            <div>
              <h5>
                Submission:
              </h5>
              <div className="d-flex align-content-start flex-wrap" style={{ display: 'flex', justifyContent: 'center' }}>
                {
                  this.centralState.projects
                    .filter(project => project.id === this.centralState.user.project)
                    .map(project => <ProjectCard key={project.id} project={project} />)
                }
              </div>
            </div>
            <div>
              <h5>
                Votes:
              </h5>
              <div className="d-flex align-content-start flex-wrap" style={{ display: 'flex', justifyContent: 'center' }}>
                {
                  this.centralState.projects
                    .filter(project => this.centralState.user.votes.includes(project.id))
                    .map(project => <ProjectCard key={project.id} project={project} />)
                }
              </div>
            </div>
          </div>
         </>
       }
      </>
    );
  }
}

export default CSComponent(Profile);
