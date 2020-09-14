import React from 'react';
import { Redirect } from 'react-router-dom';
import { CSComponent } from 'react-central-state';

import Header from '../components/Header';
import SubmissionForm from '../components/SubmissionForm';
import SubmissionNotice from '../components/SubmissionNotice';

class Submission extends React.Component {
  updateWith() {
    return ['user'];
  }

  render() {
    return (
      <>
        {
          this.centralState.user === null ? <Redirect to="" /> :
          <>
            <Header />
            <div>
              <SubmissionNotice />
              <h1 className="m-3" style={{ display: 'flex', justifyContent: 'center' }}>
                Submission
              </h1>
              <SubmissionForm />
            </div>
          </>
        }
      </>
    );
  }
}

export default CSComponent(Submission);
