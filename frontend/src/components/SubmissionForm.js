import React, { useContext, useEffect, useState } from "react";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";

import { Context } from "../Context";
import ProjectCard from "./ProjectCard";
import DeleteProject from "./DeleteProject";
import { callSubmitProject, callEditProject, callCheckZid } from "../calls";

const SubmissionForm = () => {
  const { projects, setProjects, user, setUser } = useContext(Context);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [link, setLink] = useState("");
  const [repo, setRepo] = useState("");
  const [zids, setZids] = useState([user.zid]);
  const [names, setnames] = useState([user.name]);
  const [firstyear, setFirstyear] = useState(false);
  const [postgrad, setPostgrad] = useState(false);
  const [addZid, setAddZid] = useState("");
  const [deleteShow, setDeleteShow] = useState(false);

  useEffect(() => {
    if (user.project_id !== null) {
      const project = projects.find(
        (project) => project.id === user.project_id
      );
      if (project) {
        setTitle(project.title);
        setSummary(project.summary);
        setLink(project.link);
        setRepo(project.repo);
        setZids(project.zids);
        setnames(project.names);
        setFirstyear(false);
        setPostgrad(false);
        setAddZid("");
        setDeleteShow(false);
      }
    }
  }, [projects, user]);

  const submit = () => {
    callSubmitProject(title, summary, link, repo, firstyear, postgrad, zids)
      .then((response) => {
        setProjects(
          projects.concat(response.data.project).sort((a, b) => a.id > b.id)
        );
        setUser({
          zid: user.zid,
          name: user.name,
          votes: user.votes,
          project_id: response.data.project.id,
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  const edit = () => {
    callEditProject(title, summary, link, repo, firstyear, postgrad, zids)
      .then((response) => {
        setProjects(
          projects
            .filter((project) => project.id !== user.project_id)
            .concat(response.data.project)
            .sort((a, b) => a.id > b.id)
        );
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  const deleteOpen = () => {
    setDeleteShow(true);
  };

  const deleteClose = () => {
    setDeleteShow(false);
  };

  const addTeamMember = () => {
    if (zids.length >= 3) {
      return;
    }
    callCheckZid(addZid)
      .then((response) => {
        if (user !== null) {
          setZids(zids.concat(response.data.zid));
          setnames(names.concat(response.data.name));
        }
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  const deleteTeamMember = (oldname) => {
    const index = names.indexOf(oldname);
    if (index !== -1) {
      setZids(zids.splice(index, 1));
      setnames(names.filter((name) => name !== oldname));
    }
  };

  const deleteReset = () => {
    setTitle("");
    setSummary("");
    setLink("");
    setRepo("");
    setZids([user.zids]);
    setnames([user.name]);
    setFirstyear(false);
    setPostgrad(false);
    setAddZid("");
    setDeleteShow(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Form style={{ width: "50%" }}>
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            placeholder="A Cool Project"
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="formSummary">
          <Form.Label>Summary</Form.Label>
          <Form.Control
            value={summary}
            as="textarea"
            rows="5"
            placeholder="Something very, very interesting..."
            onChange={(event) => {
              setSummary(event.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="formLink">
          <Form.Label>Link</Form.Label>
          <Form.Control
            type="text"
            value={link}
            placeholder="https://www.rust-lang.org/"
            onChange={(event) => {
              setLink(event.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="formRepo">
          <Form.Label>Repo</Form.Label>
          <Form.Control
            type="text"
            value={repo}
            placeholder="https://github.com/rust-lang/rust"
            onChange={(event) => {
              setRepo(event.target.value);
            }}
          />
          <p className="mt-3">
            These questions determine if your project can be considered for the
            First Year's Prize or the Postgraduate Prize. They will be verified.
          </p>
          <Form.Check
            className="mt-3"
            type="checkbox"
            label="Are all team members first year students?"
            onChange={(event) => {
              setFirstyear(event.target.value === "on");
            }}
          />
          <Form.Check
            className="mt-3"
            type="checkbox"
            label="Are all team members postgraduate students?"
            onChange={(event) => {
              setPostgrad(event.target.value === "on");
            }}
          />
        </Form.Group>
        <div className="my-3">
          <label>Add team members:</label>
          <InputGroup>
            <FormControl
              id="text"
              placeholder="zID"
              onChange={(event) => {
                setAddZid(event.target.value);
              }}
            />
            <Button
              variant="outline-success"
              onClick={addTeamMember}
              disabled={
                addZid.length !== 8 || zids.includes(addZid) || zids.length >= 3
              }
            >
              add
            </Button>
          </InputGroup>
        </div>
        <h5
          className="mt-4"
          style={{ display: "flex", justifyContent: "center" }}
        >
          Current Team:
        </h5>
        <div className="mt-4">
          {names.map((name, index) => (
            <InputGroup key={index} className="mb-3">
              <InputGroup.Text>{name}</InputGroup.Text>
              <Button
                variant="outline-danger"
                onClick={() => deleteTeamMember(name)}
                disabled={zids[index] === user.zid}
              >
                delete
              </Button>
            </InputGroup>
          ))}
        </div>
        <div className="mt-4">
          {user.project_id === null && (
            <Button
              variant="success"
              onClick={submit}
              disabled={
                title.length === 0 ||
                summary.length === 0 ||
                link.length === 0 ||
                repo.length === 0
              }
            >
              Submit
            </Button>
          )}
          {user.project_id !== null && (
            <div className="mb-3">
              <Button className="mx-2" variant="success" onClick={edit}>
                Save
              </Button>
              <Button className="mx-2" variant="danger" onClick={deleteOpen}>
                Delete
              </Button>
              <DeleteProject
                show={deleteShow}
                handleClose={deleteClose}
                reset={deleteReset}
              />
            </div>
          )}
        </div>
      </Form>
      <div>
        <h3 style={{ display: "flex", justifyContent: "center" }}>Preview</h3>
        <ProjectCard
          project={{
            id: 0,
            title: title,
            summary: summary,
            link: link,
            repo: repo,
            zids: zids,
            names: names,
            votes: 0,
          }}
          disabled={true}
        />
      </div>
    </div>
  );
};

export default SubmissionForm;
