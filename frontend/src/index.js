import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

// Importing React Router
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes'

// Importing Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
