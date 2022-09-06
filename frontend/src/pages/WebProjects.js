import React, { useContext } from "react";

import { Context } from "../Context";
import Header from "../components/Header";
import ProjectsNotice from "../components/ProjectsNotice";
import ProjectCard from "../components/ProjectCard";

const WebProjects = () => {
  const { webProjects } = useContext(Context);

  return (
    <>
      <Header />
      <div>
        <ProjectsNotice category="web" />
        <div
          className="d-flex align-content-start flex-wrap"
          style={{ display: "flex", justifyContent: "center" }}
        >
          {webProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </>
  );
};

export default WebProjects;
