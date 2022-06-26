import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

import { Context } from "../Context";
import Header from "../components/Header";
import SubmissionForm from "../components/SubmissionForm";
import SubmissionNotice from "../components/SubmissionNotice";

const Submission = () => {
  const { user, waiting } = useContext(Context);

  return (
    <>
      {waiting ? (
        <>
          <Header />
          <Spinner />
        </>
      ) : (
        <>
          {user === null ? (
            <Navigate to="/" />
          ) : (
            <>
              <Header />
              <div>
                <SubmissionNotice />
                <h1
                  className="m-3"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  Submission
                </h1>
                <SubmissionForm />
              </div>
            </>
          )}{" "}
        </>
      )}
    </>
  );
};

export default Submission;
