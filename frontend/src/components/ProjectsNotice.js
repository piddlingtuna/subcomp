import React from 'react';
import { CSComponent } from 'react-central-state';
import { Alert } from 'react-bootstrap';

class ProjectsNotice extends React.Component {
  updateWith() {
    return ['user', 'projectDeadline'];
  }

  render() {
    return (
      <>
        {
          this.centralState.user === null &&
          <Alert className="m-3" variant="warning">Please sign up/log in to vote! Submission closes on {this.centralState.projectDeadline}. Voting closes on {this.centralState.voteDeadline}.</Alert>
        }
        {
          this.centralState.user !== null &&
          this.centralState.user.votes.length < 3 &&
          <Alert className="m-3" variant="success">You have {3 - this.centralState.user.votes.length} vote{this.centralState.user.votes.length !== 2 && 's'} remaining. Voting closes on {this.centralState.voteDeadline}.</Alert>
        }
        {
          this.centralState.user !== null &&
          this.centralState.user.votes.length >= 3 &&
          <Alert className="m-3" variant="danger">You have no more votes remaining.</Alert>
        }
      </>
    );
  }
}

export default CSComponent(ProjectsNotice);
