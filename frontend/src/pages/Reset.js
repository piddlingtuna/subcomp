import React, { useContext, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Button, FormControl, InputGroup } from "react-bootstrap";

import { Context } from "../Context";
import Header from "../components/Header";
import { callUseReset } from "../calls";

const Reset = () => {
  const { setUser } = useContext(Context);
  const [waiting, setWaiting] = useState(true);
  const [reset, setReset] = useState(false);
  const [password, setPassword] = useState("");
  let { id } = useParams();

  const handleReset = () => {
    callUseReset(id, password)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        setWaiting(false);
        setReset(true);
      })
      .catch((error) => {
        alert(error.response.data.message);
        setWaiting(false);
        setReset(false);
      });
  };

  return (
    <>
      {reset ? (
        <Navigate to="/" />
      ) : (
        <>
          <Header />
          <div style={{ width: "75%", margin: "0 auto" }}>
            <h1
              className="m-3"
              style={{ display: "flex", justifyContent: "center" }}
            >
              Reset your password
            </h1>
            <div className="m-5">
              {waiting ? (
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
                        setPassword(event.target.value);
                      }}
                    />
                      <Button
                        variant="outline-primary"
                        disabled={password.length < 8}
                        onClick={handleReset}
                      >
                        Reset
                      </Button>
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
};

export default Reset;
