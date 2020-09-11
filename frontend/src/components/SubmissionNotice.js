import React from 'react';
import { CSComponent } from 'react-central-state';
import { Alert } from 'react-bootstrap';

class SubmissionNotice extends React.Component {
  updateWith() {
    return ['user'];
  }

  render() {
    return (
      <>
        {
          this.centralState.user.project === null &&
          <Alert className="m-3" variant="info">Please submit a project! Only one submission per team is required. Everyone on your team must have an account.</Alert>
        }
        {
          this.centralState.user.project !== null &&
          <Alert className="m-3" variant="warning">Ensure you press save if you change anything! Only one submission per team is required. Everyone on your team must have an account.</Alert>
        }
      </>
    );
  }
}

export default CSComponent(SubmissionNotice);
