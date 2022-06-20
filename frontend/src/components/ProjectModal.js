import React, { Component } from 'react';
import { CSComponent } from 'react-central-state';
import Truncate from 'react-truncate';
import { Button, Container, Col, Row, Modal } from 'react-bootstrap';

import { vote, unvote } from '../calls';

class ProjectModal extends Component {
  updateWith() {
    return ['user'];
  }

  render() {
    return (
      <Modal
        size="lg"
        show={this.props.show}
        onHide={this.props.handleClose}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Truncate lines={1} width={750}>
              <h3>{this.props.project.title}</h3>
            </Truncate>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ wordWrap: 'break-word' }}>
          Team: {this.props.project.team.join(', ')}
          <br />
          {this.props.project.summary}
        </Modal.Body>
        <Modal.Footer>
          <Container>
            <Row className="align-items-center">
              <Col>
                <a
                  href={this.props.project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Link
                </a>
              </Col>
              <Col>
                <a
                  href={this.props.project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Repo
                </a>
              </Col>
              <Col>
                {this.props.project.votes}{' '}
                {this.props.project.votes === 1 ? 'vote' : 'votes'}
              </Col>
              {this.centralState.user != null &&
                !this.centralState.user.votes.includes(
                  this.props.project.id,
                ) && (
                  <Button
                    variant="success"
                    style={{ width: '150px' }}
                    disabled={
                      this.props.disabled ||
                      this.centralState.user.votes.length >= 3
                    }
                    onClick={() => vote(this.props.project.id)}
                  >
                    Vote for project!
                  </Button>
                )}
              {this.centralState.user != null &&
                this.centralState.user.votes.includes(
                  this.props.project.id,
                ) && (
                  <Button
                    variant="danger"
                    style={{ width: '150px' }}
                    disabled={this.props.disabled}
                    onClick={() => unvote(this.props.project.id)}
                  >
                    Unvote project
                  </Button>
                )}
            </Row>
          </Container>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default CSComponent(ProjectModal);
