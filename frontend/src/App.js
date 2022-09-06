import React, { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Context } from "./Context";
import {
  callGetProjects,
  callGetProjectsByCategory,
  callGetUser,
  callGetDeadlines,
  callHasVotedForCategory,
} from "./calls";
import Projects from "./pages/Projects";
import Leaderboard from "./pages/Leaderboard";
import Submission from "./pages/Submission";
import Profile from "./pages/Profile";
import Verification from "./pages/Verification";
import Reset from "./pages/Reset";
import NotFound from "./pages/NotFound";
import WebProjects from "./pages/WebProjects";
import MobileProjects from "./pages/MobileProjects";
import GameProjects from "./pages/GameProjects";
import OtherProjects from "./pages/OtherProjects";

const App = () => {
  const {
    setProjects,
    setWebProjects,
    setMobileProjects,
    setGameProjects,
    setOtherProjects,
    setVotes,
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

    const getWebProjects = callGetProjectsByCategory("Web")
      .then((response) => {
        setWebProjects(response.data.projects.sort((a, b) => a.id > b.id));
      })
      .catch((error) => {
        setWebProjects([]);
      });

    const getMobileProjects = callGetProjectsByCategory("Mobile")
      .then((response) => {
        setMobileProjects(response.data.projects.sort((a, b) => a.id > b.id));
      })
      .catch((error) => {
        setMobileProjects([]);
      });

    const getGameProjects = callGetProjectsByCategory("Game")
      .then((response) => {
        setGameProjects(response.data.projects.sort((a, b) => a.id > b.id));
      })
      .catch((error) => {
        setGameProjects([]);
      });

    const getOtherProjects = callGetProjectsByCategory("Other")
      .then((response) => {
        setOtherProjects(response.data.projects.sort((a, b) => a.id > b.id));
      })
      .catch((error) => {
        setOtherProjects([]);
      });

    const getHasVoted = Promise.all([
      callHasVotedForCategory("Web"),
      callHasVotedForCategory("Mobile"),
      callHasVotedForCategory("Game"),
      callHasVotedForCategory("Other")
    ]).then((values) => {
      setVotes({
        web: values[0].data.has_voted,
        mobile: values[1].data.has_voted,
        game: values[2].data.has_voted,
        other: values[3].data.has_voted
      });
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

    Promise.all([
      getProjects,
      getWebProjects,
      getMobileProjects,
      getGameProjects,
      getOtherProjects,
      getHasVoted,
      getUser,
      getDeadlines,
    ]).then(() => {
      setWaiting(false);
    });
  }, [
    setProjects,
    setWebProjects,
    setMobileProjects,
    setGameProjects,
    setOtherProjects,
    setVotes,
    setUser,
    setProjectDeadline,
    setVoteDeadline,
    setWaiting,
  ]);

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Projects />} />
        <Route path="/projects/web" element={<WebProjects />} />
        <Route path="/projects/mobile" element={<MobileProjects />} />
        <Route path="/projects/game" element={<GameProjects />} />
        <Route path="/projects/other" element={<OtherProjects />} />
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
