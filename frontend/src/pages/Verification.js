import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import Header from '../components/Header';
import { verification } from '../calls';

function Verification() {
  const [state, setState] = useState({})
  let { id } = useParams()

    useEffect(() => {
      verification(id)
      .then(verified => {
        setState({
          verified: verified,
        });
      });
    }, [id])
    return (
      <>
       {
         state.verified ? <Navigate to="" /> :
         <>
          <Header />
          <div style={{ width: '75%', margin: '0 auto' }}>
            <h1 className="m-3" style={{ display: 'flex', justifyContent: 'center' }}>
              Verification
            </h1>
            <div className="m-5">
              {
                state.verified === undefined ?
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

export default Verification;
