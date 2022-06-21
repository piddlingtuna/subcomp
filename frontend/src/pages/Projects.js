import React from "react";

import { Context } from "../Context";
import Header from "../components/Header";
import ProjectsNotice from "../components/ProjectsNotice";
import ProjectCard from "../components/ProjectCard";

const Projects = () => {
  const { projects } = useContext(Context);

  return (
    <>
      <Header />
      <div>
        <ProjectsNotice />
        <div
          className="d-flex align-content-start flex-wrap"
          style={{ display: "flex", justifyContent: "center" }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Projects;
