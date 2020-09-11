import React from 'react';
import Truncate from 'react-truncate';
import { Card, Container, Col, Row } from 'react-bootstrap';

import ProjectModal from './ProjectModal';

class ProjectCard extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
    }
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen() {
    this.setState({
      show: true,
    })
  }

  handleClose() {
    this.setState({
      show: false,
    })
  }

  render() {
    return (
      <>
        <ProjectModal project={this.props.project} disabled={this.props.disabled} show={this.state.show} handleClose={this.handleClose} />
        <Card className="m-3" style={{ width: '20rem', height: '16rem' }}>
          <Card.Body onClick={this.handleOpen} style={{ cursor: 'pointer' }}>
            <Card.Title>
              <Truncate lines={1} width={250} >
                <h3>
                  {this.props.project.title}
                </h3>
              </Truncate>
            </Card.Title>
            <Truncate lines={2} width={250}>
              Team: {this.props.project.team.join(', ')}
            </Truncate>
            <br />
            <Truncate lines={4} width={250} >
              {this.props.project.summary}
            </Truncate>
          </Card.Body>
          <Card.Footer background="white">
            <Container style={{ height: '25px' }}>
              <Row>
                <Col>
                  <a href={this.props.project.link} target="_blank" rel="noopener noreferrer">
                    Link
                  </a>            
                </Col>
                <Col>
                  <a href={this.props.project.repo} target="_blank" rel="noopener noreferrer">
                    Repo
                  </a>
                </Col>
                <Col>
                  {this.props.project.votes} { this.props.project.votes === 1 ? 'vote' : 'votes'}
                </Col>
              </Row>
            </Container>
          </Card.Footer>
        </Card>
      </>
    );
  }
}

export default ProjectCard;
