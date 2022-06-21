import axios from "axios";

import { Context } from "./Context";

const { setProjects, setUser, setProjectDeadline, setVoteDeadline } =
  useContext(Context);

const getComic = () => {
  return axios
    .get("https://xkcd-imgs.herokuapp.com/")
    .then((response) => {
      return {
        title: response.data.title,
        comic: response.data.url,
      };
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
};

const getDeadlines = () => {
  axios
    .get("/api/deadlines/")
    .then((response) => {
      handler.setCentralState({
        projectDeadline: response.data.project_deadline,
        voteDeadline: response.data.vote_deadline,
      });
    })
    .catch((error) => {
      handler.setCentralState({
        projectDeadline: null,
        voteDeadline: null,
      });
      console.log(error);
    });
};

const getProjects = () => {
  axios
    .get("/api/projects/")
    .then((response) => {
      handler.setCentralState({
        projects: response.data.projects.sort((a, b) => a.id > b.id),
      });
    })
    .catch((error) => {
      handler.setCentralState({
        projects: [],
      });
      console.log(error);
    });
};

const getUser = () => {
  if (localStorage.getItem("token")) {
    axios
      .get("/api/user/", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        handler.setCentralState({
          user: response.data.user,
        });
      })
      .catch((error) => {
        handler.setCentralState({
          user: null,
        });
        console.log(error);
      });
  } else {
    handler.setCentralState({
      user: null,
    });
  }
};

const generateVerification = (zid, fullName, password) => {
  axios
    .post("/api/generate_verification/", {
      zid: zid,
      full_name: fullName,
      password: password,
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
};

const verification = (token) => {
  return axios
    .post("/api/use_verification/", {
      token: token,
    })
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      handler.setCentralState({
        user: response.data.user,
      });
      return true;
    })
    .catch((error) => {
      alert(error.response.data.message);
      return false;
    });
};

const logIn = (zid, password) => {
  axios
    .post("/api/login/", {
      zid: zid,
      password: password,
    })
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      handler.setCentralState({
        user: response.data.user,
      });
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
};

const logOut = () => {
  axios
    .get("/api/logout/", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
    .then(() => {
      localStorage.removeItem("token");
      handler.setCentralState({
        user: null,
      });
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
};

const changeFullName = (fullName) => {
  axios
    .post(
      "/api/change_full_name/",
      {
        full_name: fullName,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    )
    .then(() => {
      handler.setCentralState({
        user: {
          zid: handler.centralState.user.zid,
          fullName: fullName,
          votes: handler.centralState.user.votes,
          project: handler.centralState.user.project,
        },
      });
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
};

const changePassword = (password) => {
  axios
    .post(
      "/api/change_password/",
      {
        password: password,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    )
    .catch((error) => {
      alert(error.response.data.message);
    });
};

const generateReset = (zid) => {
  axios
    .post("/api/generate_reset/", {
      zid: zid,
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
};

const useReset = (token, password) => {
  return axios
    .post("/api/use_reset/", {
      token: token,
      password: password,
    })
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      handler.setCentralState({
        user: response.data.user,
      });
      return true;
    })
    .catch((error) => {
      alert(error.response.data.message);
      return false;
    });
};

const vote = (project_id) => {
  axios
    .post(
      "/api/vote/",
      {
        project_id: project_id,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    )
    .then(() => {
      const project = handler.centralState.projects.filter(
        (project) => project.id === project_id
      )[0];
      project.votes++;
      handler.setCentralState({
        user: {
          zid: handler.centralState.user.zid,
          fullName: handler.centralState.user.fullName,
          votes: handler.centralState.user.votes.concat(project_id),
          project: handler.centralState.user.project,
        },
        projects: handler.centralState.projects
          .filter((project) => project.id !== project_id)
          .concat(project)
          .sort((a, b) => a.id > b.id),
      });
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
};

const unvote = (project_id) => {
  axios
    .post(
      "/api/unvote/",
      {
        project_id: project_id,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    )
    .then(() => {
      const project = handler.centralState.projects.filter(
        (project) => project.id === project_id
      )[0];
      project.votes--;
      handler.setCentralState({
        user: {
          zid: handler.centralState.user.zid,
          fullName: handler.centralState.user.fullName,
          votes: handler.centralState.user.votes.filter(
            (id) => id !== project_id
          ),
          project: handler.centralState.user.project,
        },
        projects: handler.centralState.projects
          .filter((project) => project.id !== project_id)
          .concat(project)
          .sort((a, b) => a.id > b.id),
      });
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
};

const checkzid = (zid) => {
  return axios
    .post(
      "/api/check_zid/",
      {
        zid: zid,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    )
    .then((response) => {
      return {
        zid: response.data.zid,
        fullName: response.data.fullName,
      };
    })
    .catch((error) => {
      alert(error.response.data.message);
      return null;
    });
};

const submitProject = (
  title,
  summary,
  link,
  repo,
  first_year,
  postgraduate,
  team_zids
) => {
  axios
    .post(
      "/api/submit_project/",
      {
        title: title,
        summary: summary,
        link: link,
        repo: repo,
        first_year: first_year,
        postgraduate: postgraduate,
        team_zids: team_zids,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    )
    .then((response) => {
      handler.setCentralState({
        user: {
          zid: handler.centralState.user.zid,
          fullName: handler.centralState.user.zid,
          votes: handler.centralState.user.votes,
          project: response.data.project.id,
        },
        projects: handler.centralState.projects
          .concat(response.data.project)
          .sort((a, b) => a.id > b.id),
      });
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
};

const editProject = (
  title,
  summary,
  link,
  repo,
  first_year,
  postgraduate,
  team_zids
) => {
  const id = handler.centralState.user.project;
  axios
    .post(
      "/api/edit_project/",
      {
        title: title,
        summary: summary,
        link: link,
        repo: repo,
        first_year: first_year,
        postgraduate: postgraduate,
        team_zids: team_zids,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    )
    .then((response) => {
      handler.setCentralState({
        projects: handler.centralState.projects
          .filter((project) => project.id !== id)
          .concat(response.data.project)
          .sort((a, b) => a.id > b.id),
      });
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
};

const deleteProject = () => {
  const id = handler.centralState.user.project;
  axios
    .get("/api/delete_project/", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
    .then(() => {
      handler.setCentralState({
        user: {
          zid: handler.centralState.user.zid,
          fullName: handler.centralState.user.zid,
          votes: handler.centralState.user.votes,
          project: null,
        },
        projects: handler.centralState.projects.filter(
          (project) => project.id !== id
        ),
      });
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
};

export {
  getComic,
  getDeadlines,
  getProjects,
  getUser,
  generateVerification,
  verification,
  logIn,
  logOut,
  changeFullName,
  changePassword,
  generateReset,
  useReset,
  vote,
  unvote,
  checkzid,
  submitProject,
  editProject,
  deleteProject,
};
