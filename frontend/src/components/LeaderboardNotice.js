import React, { useContext } from "react";
import { Alert } from "react-bootstrap";

import { Context } from "../Context";

const LeaderboardNotice = () => {
  const { voteDeadline } = useContext(Context);
  return (
    <Alert className="m-3" variant="info">
      First place wins the Hitchhiker's Prize!
      {voteDeadline && ` Voting closes on ${this.centralState.voteDeadline}.`}
    </Alert>
  );
};

export default LeaderboardNotice;
