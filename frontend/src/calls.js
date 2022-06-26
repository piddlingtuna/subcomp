import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

const callGetComic = () => {
  return axios
    .get("https://xkcd-imgs.herokuapp.com/")
    .then((response) => {
      return {
        title: response.data.title,
        comic: response.data.url,
      };
    })
    .catch((error) => {});
};

const callGetProjects = () => {
  return axios.get("/api/projects/");
};

const callGetDeadlines = () => {
  return axios.get("/api/deadlines/");
};

const callGetUser = () => {
  return axios.get("/api/user/", {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

const callGenerateVerification = (zID, name, password) => {
  return axios.post("/api/generate_verification/", {
    zid: zID,
    name: name,
    password: password,
  });
};

const callUseVerification = (token) => {
  return axios.post("/api/use_verification/", {
    token: token,
  });
};

const callLogIn = (zID, password) => {
  return axios.post("/api/login/", {
    zid: zID,
    password: password,
  });
};

const callLogOut = () => {
  return axios.get("/api/logout/", {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

const callChangename = (name) => {
  return axios.post(
    "/api/change_name/",
    {
      name: name,
    },
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

const callChangePassword = (password) => {
  return axios.post(
    "/api/change_password/",
    {
      password: password,
    },
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

const callGenerateReset = (zID) => {
  return axios.post("/api/generate_reset/", {
    zid: zID,
  });
};

const callUseReset = (token, password) => {
  return axios.post("/api/use_reset/", {
    token: token,
    password: password,
  });
};

const callVote = (project_id) => {
  return axios.post(
    "/api/vote/",
    {
      project_id: project_id,
    },
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

const callUnvote = (project_id) => {
  return axios.post(
    "/api/unvote/",
    {
      project_id: project_id,
    },
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

const callCheckZid = (zID) => {
  return axios.post(
    "/api/check_zid/",
    {
      zid: zID,
    },
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

const callSubmitProject = (
  title,
  summary,
  link,
  repo,
  firstyear,
  postgrad,
  zIDs
) => {
  return axios.post(
    "/api/submit_project/",
    {
      title: title,
      summary: summary,
      link: link,
      repo: repo,
      firstyear: firstyear,
      postgrad: postgrad,
      zids: zIDs,
    },
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

const callEditProject = (
  title,
  summary,
  link,
  repo,
  firstyear,
  postgrad,
  zIDs
) => {
  return axios.post(
    "/api/edit_project/",
    {
      title: title,
      summary: summary,
      link: link,
      repo: repo,
      firstyear: firstyear,
      postgrad: postgrad,
      zids: zIDs,
    },
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

const callDeleteProject = () => {
  return axios.get("/api/delete_project/", {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

export {
  callGetComic,
  callGetProjects,
  callGetUser,
  callGetDeadlines,
  callGenerateVerification,
  callUseVerification,
  callLogIn,
  callLogOut,
  callChangename,
  callChangePassword,
  callGenerateReset,
  callUseReset,
  callVote,
  callUnvote,
  callCheckZid,
  callSubmitProject,
  callEditProject,
  callDeleteProject,
};
