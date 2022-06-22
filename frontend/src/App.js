import React, { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Context } from "./Context";
import { callGetProjects, callGetUser, callGetDeadlines } from "./calls";
import Projects from "./pages/Projects";
import Leaderboard from "./pages/Leaderboard";
import Submission from "./pages/Submission";
import Profile from "./pages/Profile";
import Verification from "./pages/Verification";
import Reset from "./pages/Reset";
import NotFound from "./pages/NotFound";

const App = () => {
  const { setProjects, setUser, setProjectDeadline, setVoteDeadline } =
    useContext(Context);

  useEffect(() => {
    callGetProjects()
    .then((response) => {
      setProjects(response.data.projects.sort((a, b) => a.id > b.id));
    })
    .catch((error) => {
      setProjects([]);
    });

  callGetUser()
    .then((response) => {
        setUser(response.data.user);
    })
    .catch((error) => {
      setUser(null);
    });

  callGetDeadlines()
    .then((response) => {
      setProjectDeadline(response.data.projectDeadline);
      setVoteDeadline(response.data.voteDeadline);
    })
    .catch((error) => {
      setProjectDeadline(null);
      setVoteDeadline(null);
    });
  }, [setProjects, setUser, setProjectDeadline, setVoteDeadline]);

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
