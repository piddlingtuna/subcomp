import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import Header from "../components/Header";
import { verification } from "../calls";

const Verification = () => {
  const [waiting, setWaiting] = useState(true);
  const [verified, setVerified] = useState(false);
  let { id } = useParams();

  useEffect(() => {
    verification(id).then((verified) => {
      setWaiting(false);
      setVerified(verified);
    });
  }, [id]);

  return (
    <>
      {verified ? (
        <Navigate to="" />
      ) : (
        <>
          <Header />
          <div style={{ width: "75%", margin: "0 auto" }}>
            <h1
              className="m-3"
              style={{ display: "flex", justifyContent: "center" }}
            >
              Verification
            </h1>
            <div className="m-5">
              {waiting ? (
                <p>We're just verifying your account...</p>
              ) : (
                <p>This link is invalid :(</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Verification;
