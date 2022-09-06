import React, { useContext } from "react";
import { Alert } from "react-bootstrap";

import { Context } from "../Context";

const ProjectsNotice = ({ category }) => {
  const { user, votes, projectDeadline, voteDeadline } = useContext(Context);
  const numVotes = Object.values(votes).filter(value => value).length;

  return (
    <>
      {projectDeadline !== null && voteDeadline !== null ? (
        <>
          {user === null && (
            <Alert className="m-3" variant="warning">
              Please sign up/log in to vote! Submission closes on{" "}
              {projectDeadline}. Voting closes on {voteDeadline}.
            </Alert>
          )}
          {user !== null && category === undefined && (
            <Alert className="m-3" variant="success">
              You have {4 - numVotes} votes remaining. Voting closes on {voteDeadline}.
            </Alert>
          )}
          {user !== null && category !== undefined && !votes[category] && (
            <Alert className="m-3" variant="success">
              You have not voted for this category. Voting closes on{" "}
              {voteDeadline}.
            </Alert>
          )}
          {user !== null && category !== undefined && votes[category] && (
            <Alert className="m-3" variant="danger">
              You have no more votes remaining for this category.
            </Alert>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ProjectsNotice;
