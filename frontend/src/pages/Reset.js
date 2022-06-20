import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Button, FormControl, InputGroup } from 'react-bootstrap';

import Header from '../components/Header';
import { reset } from '../calls';

function Reset() {
  const [state, setState] = useState({
    password: '',
  });
  let { id } = useParams();

  const handleReset = () => {
    reset(id, state.password).then((reset) => {
      setState({
        reset: reset,
      });
    });
  };

  return (
    <>
      {state.reset ? (
        <Navigate to="" />
      ) : (
        <>
          <Header />
          <div style={{ width: '75%', margin: '0 auto' }}>
            <h1
              className="m-3"
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              Reset your password
            </h1>
            <div className="m-5">
              {state.reset === undefined ? (
                <div>
                  <p>
                    Please enter in your new password (make sure to remember it
                    this time lol)
                  </p>
                  <InputGroup className="mb-3">
                    <FormControl
                      type="password"
                      placeholder="password"
                      aria-label="password"
                      onChange={(event) => {
                        setState({
                          password: event.target.value,
                        });
                      }}
                    />
                    <InputGroup.Append>
                      <Button
                        variant="outline-primary"
                        disabled={state.password.length < 8}
                        onClick={handleReset}
                      >
                        Reset
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </div>
              ) : (
                <p>This link is invalid :(</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Reset;
