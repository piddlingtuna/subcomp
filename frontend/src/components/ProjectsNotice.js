import React from "react";
import { Alert } from "react-bootstrap";

const ProjectsNotice = () => {
  const { user, projectDeadline, voteDeadline } = useContext(Context);

  return (
    <>
      {user === null && (
        <Alert className="m-3" variant="warning">
          Please sign up/log in to vote! Submission closes on {projectDeadline}.
          Voting closes on {voteDeadline}.
        </Alert>
      )}
      {user !== null && user.votes.length < 3 && (
        <Alert className="m-3" variant="success">
          You have {3 - user.votes.length} vote
          {user.votes.length !== 2 && "s"} remaining. Voting closes on{" "}
          {voteDeadline}.
        </Alert>
      )}
      {user !== null && user.votes.length >= 3 && (
        <Alert className="m-3" variant="danger">
          You have no more votes remaining.
        </Alert>
      )}
    </>
  );
};

export default ProjectsNotice;
