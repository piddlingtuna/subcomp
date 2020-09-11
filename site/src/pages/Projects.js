import React from 'react';
import { CSComponent } from 'react-central-state';

import Header from '../components/Header';
import ProjectsNotice from '../components/ProjectsNotice';
import ProjectCard from '../components/ProjectCard';

class Projects extends React.Component {
  updateWith() {
    return ['projects'];
  }

  render() {
    return (
      <>
        <Header />
        <div>
          <ProjectsNotice />
          <div className="d-flex align-content-start flex-wrap" style={{ display: 'flex', justifyContent: 'center' }}>
            {
              this.centralState.projects
              .map(project =><ProjectCard key={project.id} project={project} />)
            }
          </div>
          <div className="my-5" />
        </div>
      </>
    );
  }
}

export default CSComponent(Projects);
