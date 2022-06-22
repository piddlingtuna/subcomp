import React, { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import { Context } from "../Context";
import Header from "../components/Header";
import { callUseVerification } from "../calls";

const Verification = () => {
  const { setUser } = useContext(Context);

  const [waiting, setWaiting] = useState(true);
  const [verified, setVerified] = useState(false);
  let { id } = useParams();

  useEffect(() => {
    callUseVerification(id)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        setWaiting(false);
        setVerified(true);
      })
      .catch((error) => {
        setWaiting(false);
        setVerified(false);
        alert(error.response.data.message);
      });
  }, [id, setUser]);

  return (
    <>
      {verified ? (
        <Navigate to="/" />
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
