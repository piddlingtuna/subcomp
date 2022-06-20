import React from 'react';
import { CSComponent } from 'react-central-state';
import { Alert } from 'react-bootstrap';

class LeaderboardNotice extends React.Component {
  updateWith() {
    return ['voteDeadline'];
  }

  render() {
    return (
      <Alert className="m-3" variant="info">
        First place wins the Hitchhiker's Prize!
        {this.centralState.voteDeadline &&
          ` Voting closes on ${this.centralState.voteDeadline}.`}
      </Alert>
    );
  }
}

export default CSComponent(LeaderboardNotice);
