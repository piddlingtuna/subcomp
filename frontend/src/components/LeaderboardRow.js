import React from "react";

import ProjectModal from "./ProjectModal";

const LeaderboardRow = (props) => {
  const [show, setShow] = useState(false);

  const handleOpen = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <tr
        key={props.project.id}
        style={{ cursor: "pointer" }}
        onClick={handleOpen}
      >
        <td>{props.rank}</td>
        <td>{props.project.title}</td>
        <td>{props.project.votes}</td>
      </tr>
      <ProjectModal
        show={show}
        handleClose={handleClose}
        project={props.project}
      />
    </>
  );
};

export default LeaderboardRow;
