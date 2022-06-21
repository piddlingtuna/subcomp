import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import history from "./history";
import { getDeadlines, getProjects, getUser } from "./calls";
import Projects from "./pages/Projects";
import Leaderboard from "./pages/Leaderboard";
import Submission from "./pages/Submission";
import Profile from "./pages/Profile";
import Verification from "./pages/Verification";
import Reset from "./pages/Reset";
import NotFound from "./pages/NotFound";

const App = () => {
  getDeadlines();
  getProjects();
  getUser();
  return (
    <BrowserRouter history={history}>
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
