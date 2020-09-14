import React from 'react';
import { CSComponent } from 'react-central-state';
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap';

import ProjectCard from './ProjectCard';
import DeleteProject from './DeleteProject';
import { submitProject, editProject, checkZID } from '../calls';

class SubmissionForm extends React.Component {
  constructor() {
    super();
    const id = this.centralState.user.project
    if (id !== null) {
      const project = this.centralState.projects.filter(project => project.id === id)[0];
      this.state = {
        title: project.title,
        summary: project.summary,
        link: project.link,
        repo: project.repo,
        team_zids: project.team_zids,
        team: project.team,
        firstYear: false,
        postgrad: false,
        addZID: '',
        deleteShow: false,
      }
    } else {
      this.state = {
        title: '',
        summary: '',
        link: '',
        repo: '',
        team_zids: [this.centralState.user.zID],
        team: [this.centralState.user.fullName],
        firstYear: false,
        postgrad: false,
        addZID: '',
        deleteShow: false,
      }
    }
    this.submit = this.submit.bind(this);
    this.edit = this.edit.bind(this);
    this.deleteOpen = this.deleteOpen.bind(this);
    this.deleteClose = this.deleteClose.bind(this);
    this.addTeamMember = this.addTeamMember.bind(this);
    this.deleteTeamMember = this.deleteTeamMember.bind(this);
    this.deleteReset = this.deleteReset.bind(this);
  }

  submit() {
    submitProject(this.state.title, this.state.summary, this.state.link, this.state.repo, this.state.firstYear, this.state.postgrad, this.state.team_zids);
  }

  edit () {
    editProject(this.state.title, this.state.summary, this.state.link, this.state.repo, this.state.firstYear, this.state.postgrad, this.state.team_zids);
  }

  deleteOpen() {
    this.setState({
      deleteShow: true,
    });
  }

  deleteClose() {
    this.setState({
      deleteShow: false,
    });
  }

  addTeamMember() {
    if (this.state.team_zids.length >= 3) {
      return;
    }
    checkZID(this.state.addZID)
      .then(user => {
        if (user !== null) {
          this.setState({
            team_zids: this.state.team_zids.concat(user.zID),
            team: this.state.team.concat(user.fullName),
          })
        }
      })
  }

  deleteTeamMember(oldFullName) {
    const index = this.state.team.indexOf(oldFullName);
    if (index !== -1) {
      this.setState({
        team_zids: this.state.team_zids.splice(index, 1),
        team: this.state.team.filter(fullName => fullName !== oldFullName),
      })
    }
  }

  deleteReset() {
    this.setState({
      title: '',
      summary: '',
      link: '',
      repo: '',
      team_zids: [this.centralState.user.zID],
      team: [this.centralState.user.fullName],
      firstYear: false,
      postgrad: false,
      addZID: '',
      deleteShow: false,
    });
  }

  updateWith() {
    return ['user', 'projects'];
  }

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Form style={{ width: '50%' }}>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={this.state.title}
              placeholder="A Cool Project"
              onChange={event => {
                  this.setState({
                    title: event.target.value,
                  })
                }}
            />
          </Form.Group>
          <Form.Group controlId="formSummary">
            <Form.Label>Summary</Form.Label>
            <Form.Control
              value={this.state.summary}
              as="textarea"
              rows="5"
              placeholder="Something very, very interesting..."
              onChange={
                event => {this.setState({
                    summary: event.target.value,
                  })
                }}
            />
          </Form.Group>
          <Form.Group controlId="formLink">
            <Form.Label>Link</Form.Label>
            <Form.Control
              type="text"
              value={this.state.link}
              placeholder="https://www.rust-lang.org/"
              onChange={event => {
                  this.setState({
                    link: event.target.value,
                  })
                }}
            />
          </Form.Group>
          <Form.Group controlId="formRepo">
            <Form.Label>Repo</Form.Label>
            <Form.Control
              type="text"
              value={this.state.repo}
              placeholder="https://github.com/rust-lang/rust"
              onChange={event => {
                this.setState({
                  repo: event.target.value,
                })
              }}
            />
          <p className="mt-3">
            These questions determine if your project can be considered for the First Year's Prize or the Postgraduate Prize. They will be verified.
          </p>
          <Form.Check
            className="mt-3"
            type="checkbox"
            label="Did all team members commence as Undergraduate students in 2020?"
            onChange={event => {
              this.setState({
                firstYear: event.target.value === "on",
              })
            }}
          />
          <Form.Check 
            className="mt-3"
            type="checkbox"
            label="Are all team members enrolled as Postgraduate students?"
            onChange={event => {
              this.setState({
                postgrad: event.target.value === "on",
              })
            }}
          />
          </Form.Group>
          <div className="my-3">
            <label>Add team members:</label>
            <InputGroup>
              <FormControl
                id="text"
                placeholder="zID"
                onChange={event => {
                  this.setState({
                    addZID: event.target.value,
                  })
                }}
              />
              <InputGroup.Append>
                <Button variant="outline-success" onClick={this.addTeamMember} disabled={this.state.addZID.length !== 8 || this.state.team_zids.length >= 3}>
                  add
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
          <h5 className="mt-4" style={{ display: 'flex', justifyContent: 'center' }}>
            Current Team:
          </h5>
          <div className="mt-4">
            {
              this.state.team.map((fullName, index) =>
                <InputGroup key={index} className="mb-3">
                  <InputGroup.Text>
                    {fullName}
                  </InputGroup.Text>
                    <InputGroup.Append>
                      <Button variant="outline-danger" onClick={() => this.deleteTeamMember(fullName)} disabled={this.state.team_zids[index] === this.centralState.user.zID}>
                        delete
                      </Button>
                    </InputGroup.Append>
                </InputGroup>
              )
            }
          </div>
          <div className="mt-4">
            {
              this.centralState.user.project === null &&
              <Button variant="success" onClick={this.submit} disabled={this.state.title.length === 0 || this.state.summary.length === 0 || this.state.link.length === 0 || this.state.repo.length === 0}>
                Submit
              </Button>
            }
            {
              this.centralState.user.project !== null &&
              <div className="mb-3">
                <Button className="mx-2" variant="success" onClick={this.edit}>
                  Save
                </Button>
                <Button className="mx-2" variant="danger" onClick={this.deleteOpen}>
                  Delete
                </Button>
                <DeleteProject show={this.state.deleteShow} handleClose={this.deleteClose} reset={this.deleteReset} />
              </div>
            }
          </div>
        </Form>
        <div>
          <h3 style={{ display: 'flex', justifyContent: 'center' }}>
            Preview
          </h3>
          <ProjectCard
            project={
              {
                id: 0,
                title: this.state.title,
                summary: this.state.summary,
                link: this.state.link,
                repo: this.state.repo,
                team: this.state.team,
                votes: 0
              }
            }
            disabled={true}
          />
        </div>
      </div>
    );
  }

}

export default CSComponent(SubmissionForm);
