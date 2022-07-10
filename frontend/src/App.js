import React, { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Context } from "./Context";
import { callGetProjects, callGetProjectsByCategory, callGetUser, callGetDeadlines } from "./calls";
import Projects from "./pages/Projects";
import Leaderboard from "./pages/Leaderboard";
import Submission from "./pages/Submission";
import Profile from "./pages/Profile";
import Verification from "./pages/Verification";
import Reset from "./pages/Reset";
import NotFound from "./pages/NotFound";

const App = () => {
  const {
    setProjects,
    setUser,
    setProjectDeadline,
    setVoteDeadline,
    setWaiting,
  } = useContext(Context);

  useEffect(() => {
    const getProjects = callGetProjects()
      .then((response) => {
        setProjects(response.data.projects.sort((a, b) => a.id > b.id));
      })
      .catch((error) => {
        setProjects([]);
      });

    const getUser = callGetUser()
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        setUser(null);
      });

    const getDeadlines = callGetDeadlines().then((response) => {
      setProjectDeadline(response.data.projectDeadline);
      setVoteDeadline(response.data.voteDeadline);
    });

    Promise.all([getProjects, getUser, getDeadlines]).then(() => {
      setWaiting(false);
    });
  }, [setProjects, setUser, setProjectDeadline, setVoteDeadline, setWaiting]);

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Projects />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/submission" element={<Submission />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/verification/:id" element={<Verification />} />
        <Route path="/reset/:id" element={<Reset />} />
        <Route element={NotFound} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
