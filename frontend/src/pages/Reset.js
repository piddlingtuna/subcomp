import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { Button, FormControl, InputGroup } from 'react-bootstrap';

import Header from '../components/Header';
import { useReset } from '../calls';

class Reset extends React.Component {
  constructor() {
    super();
    this.state = {
      password: '',
    };
    this.handleReset = this.handleReset.bind(this);
  }

  handleReset() {
    useReset(this.props.match.params.id, this.state.password)
      .then(reset => {
        this.setState({
          reset: reset,
        });
      });
  }

  render() {
    return (
      <>
       {
         this.state.reset ? <Redirect to="" /> :
         <>
          <Header />
          <div style={{ width: '75%', margin: '0 auto' }}>
            <h1 className="m-3" style={{ display: 'flex', justifyContent: 'center' }}>
              Reset your password
            </h1>
            <div className="m-5">
              {
                this.state.reset === undefined ?
                <div>
                  <p>
                    Please enter in your new password (make sure to remember it this time lol)
                  </p>
                  <InputGroup className="mb-3">
                    <FormControl
                      type="password"
                      placeholder="password"
                      aria-label="password"
                      onChange={event => {
                        this.setState({
                          password: event.target.value,
                        })
                      }}
                    />
                    <InputGroup.Append>
                      <Button variant="outline-primary" disabled={this.state.password.length < 8} onClick={this.handleReset}>
                        Reset
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </div>
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

export default withRouter(Reset);
