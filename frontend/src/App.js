import React from 'react';
import { CSComponent } from 'react-central-state';
import { Router, Routes, Route } from 'react-router-dom';

import history from './history';
import { getDeadlines, getProjects, getUser } from './calls';
import Projects from './pages/Projects';
import Leaderboard from './pages/Leaderboard';
import Submission from './pages/Submission';
import Profile from './pages/Profile';
import Verification from './pages/Verification'
import Reset from './pages/Reset';
import NotFound from './pages/NotFound';

class App extends React.Component {
  constructor() {
    super();
    this.setCentralState({
      projects: [],
      user: null,
    })
    getDeadlines();
    getProjects();
    getUser();
  }

  updateWith() {
    return [];
  }

  render() {
    return (
      <Router history={history}>
        <Routes>
          <Route exact path="/" component={Projects}/>
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/submission" component={Submission} />
          <Route path="/profile" component={Profile} />
          <Route path="/verification/:id" component={Verification} />
          <Route path="/reset/:id" component={Reset} />
          <Route component={NotFound} />
        </Routes>
      </Router>
    );
  }
}

export default CSComponent(App);
