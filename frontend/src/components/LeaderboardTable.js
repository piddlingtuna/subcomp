import React, { useContext, useEffect, useState } from "react";
import { FormControl, InputGroup, Table } from "react-bootstrap";

import { Context } from "../Context";
import LeaderboardRow from "./LeaderboardRow";

// From https://github.com/CGally/react-leaderboard

const LeaderboardTable = () => {
  const { projects } = useContext(Context);

  const [ranking, setRanking] = useState([]);
  const [asc, setAsc] = useState(false);
  const [alph, setAlph] = useState(false);

  useEffect(() => {
    const ranking = projects;
    ranking.sort(compareVotes).reverse();
    ranking.map((project, index) => (project.rank = index + 1));
    setRanking(ranking);
  }, [projects]);

  const rank = () => {
    const ranking = projects;
    ranking.sort(compareVotes).reverse();
    ranking.map((project, index) => (project.rank = index + 1));
    return ranking;
  };

  const rankDefault = (ranking) => {
    ranking.sort(compareVotes).reverse();
    ranking.map((project, index) => (project.rank = index + 1));
    return ranking;
  };

  const compareVotes = (a, b) => {
    if (a.votes < b.votes) return -1;
    if (a.votes > b.votes) return 1;
    return 0;
  };

  const compareTitle = (a, b) => {
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  };

  const sortProjectsByVotes = (projects) => {
    const ranking = rank(projects);
    if (asc === true) {
      ranking.sort(compareVotes).reverse();
      setRanking(ranking);
      setAsc(false);
      setAlph(false);
    } else {
      ranking.sort(compareVotes);
      setRanking(ranking);
      setAsc(true);
      setAlph(false);
    }
  };

  const sortProjectsByTitle = (projects) => {
    const ranking = rank(projects);
    if (alph === true) {
      ranking.sort(compareTitle).reverse();
      setRanking(ranking);
      setAsc(false);
      setAlph(true);
    } else {
      setRanking(ranking);
      ranking.sort(compareTitle);
      setAsc(true);
      setAlph(true);
    }
  };

  const filterRank = (event, projects) => {
    const ranking = rank(projects);
    const newRanking = [];
    const inputLength = event.target.value.length;
    for (let project in ranking) {
      const titlePrefix = project.title.slice(0, inputLength).toLowerCase();
      if (titlePrefix === event.target.value.toLowerCase()) {
        newRanking.push(project);
      }
    }
    newRanking.sort(compareVotes).reverse();
    setRanking(newRanking);
  };

  return (
    <Table className="m-3" style={{ width: "50%" }}>
      <tbody>
        <tr>
          <td colSpan="3">
            <InputGroup>
              <FormControl
                placeholder="Search"
                onChange={(e) => filterRank(e, projects)}
              />
            </InputGroup>
          </td>
        </tr>
        <tr style={{ cursor: "pointer" }}>
          <td onClick={() => sortProjectsByVotes(projects)}> Rank </td>
          <td onClick={() => sortProjectsByTitle(projects)}> Title </td>
          <td onClick={() => sortProjectsByVotes(projects)}> Votes </td>
        </tr>
        {ranking === []
          ? rankDefault(projects).map((project) => (
              <LeaderboardRow
                key={project.id}
                rank={project.rank}
                project={project}
              />
            ))
          : ranking.map((project) => (
              <LeaderboardRow
                key={project.id}
                rank={project.rank}
                project={project}
              />
            ))}
      </tbody>
    </Table>
  );
};

export default LeaderboardTable;
