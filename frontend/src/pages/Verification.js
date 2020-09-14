import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';

import Header from '../components/Header';
import { useVerification } from '../calls';

class Verification extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  
  componentDidMount() {
    useVerification(this.props.match.params.id)
    .then(verified => {
      this.setState({
        verified: verified,
      });
    });
  }

  render() {
    return (
      <>
       {
         this.state.verified ? <Redirect to="" /> :
         <>
          <Header />
          <div style={{ width: '75%', margin: '0 auto' }}>
            <h1 className="m-3" style={{ display: 'flex', justifyContent: 'center' }}>
              Verification
            </h1>
            <div className="m-5">
              {
                this.state.verified === undefined ?
                <p>
                  We're just verifying your account...
                </p>
                :
                <p>
                  This link is invalid :(
                </p>
              }              
            </div>
          </div>
         </>
       }
      </>
    );
  }
}

export default withRouter(Verification);
