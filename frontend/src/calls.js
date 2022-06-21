import axios from "axios";

const callGetComic = () => {
  return axios
    .get("https://xkcd-imgs.herokuapp.com/")
    .then((response) => {
      return {
        title: response.data.title,
        comic: response.data.url,
      };
    })
    .catch((error) => {
      return null;
    });
};

const callGetProjects = () => {
  return axios.get("/api/projects/");
};

const callGetDeadlines = () => {
  return axios.get("/api/deadlines/");
};

const callGetUser = () => {
  if (localStorage.getItem("token")) {
    return axios.get("/api/user/", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
  } else {
    return Promise.resolve();
  }
};

const callGenerateVerification = (zID, fullName, password) => {
  return axios.post("/api/generate_verification/", {
    zID: zID,
    fullName: fullName,
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
    zID: zID,
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

const callChangeFullName = (fullName) => {
  return axios.post(
    "/api/change_full_name/",
    {
      fullName: fullName,
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
    zID: zID,
  });
};

const callUseReset = (token, password) => {
  return axios.post("/api/use_reset/", {
    token: token,
    password: password,
  });
};

const callVote = (projectId) => {
  return axios.post(
    "/api/vote/",
    {
      projectId: projectId,
    },
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

const callUnvote = (projectId) => {
  return axios.post(
    "/api/unvote/",
    {
      projectId: projectId,
    },
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

const callCheckZID = (zID) => {
  return axios.post(
    "/api/check_zID/",
    {
      zID: zID,
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
  first_year,
  postgraduate,
  zIDs
) => {
  axios.post(
    "/api/submit_project/",
    {
      title: title,
      summary: summary,
      link: link,
      repo: repo,
      first_year: first_year,
      postgraduate: postgraduate,
      zIDs: zIDs,
    },
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

const callEditProject = (
  id,
  title,
  summary,
  link,
  repo,
  first_year,
  postgraduate,
  zIDs
) => {
  axios.post(
    "/api/edit_project/",
    {
      title: title,
      summary: summary,
      link: link,
      repo: repo,
      first_year: first_year,
      postgraduate: postgraduate,
      zIDs: zIDs,
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
  callChangeFullName,
  callChangePassword,
  callGenerateReset,
  callUseReset,
  callVote,
  callUnvote,
  callCheckZID,
  callSubmitProject,
  callEditProject,
  callDeleteProject,
};
