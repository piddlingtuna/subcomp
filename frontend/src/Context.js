import React, { createContext, useState } from "react";

export const Context = createContext({
  projects: [],
  setProjects: () => {},
  user: null,
  setUser: () => {},
  projectDeadline: null,
  setProjectDeadline: () => {},
  voteDeadline: null,
  setVoteDeadline: () => {},
});

const ContextProvider = ({ children}) => {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [projectDeadline, setProjectDeadline] = useState(null);
  const [voteDeadline, setVoteDeadline] = useState(null);

  const initialContext = {
    projects,
    setProjects,
    user,
    setUser,
    projectDeadline,
    setProjectDeadline,
    voteDeadline,
    setVoteDeadline,
  };

  return <Context.Provider value={initialContext}>{children}</Context.Provider>;
};

export default ContextProvider;
