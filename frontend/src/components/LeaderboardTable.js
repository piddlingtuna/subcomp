import React from 'react';
import { CSComponent } from 'react-central-state';
import { FormControl, InputGroup, Table } from 'react-bootstrap';

import LeaderboardRow from './LeaderboardRow';

// From https://github.com/CGally/react-leaderboard

class LeaderboardTable extends React.Component {
  constructor() {
    super();
    this.state = {
      ranking: [],
      asc: false,
      alph: false,
    };
    this.sortProjectsByVotes = this.sortProjectsByVotes.bind(this);
    this.sortProjectsByTitle = this.sortProjectsByTitle.bind(this);
    this.filterRank = this.filterRank.bind(this);
  }

  componentDidMount() {
    const ranking = this.centralState.projects;
    ranking.sort(this.compareVotes).reverse();
    ranking.map((project, index) => (project.rank = index + 1));
    this.setState({ ranking: ranking });
  }

  rank() {
    const ranking = this.centralState.projects;
    ranking.sort(this.compareVotes).reverse();
    ranking.map((project, index) => (project.rank = index + 1));
    return ranking;
  }

  rankDefault(ranking) {
    ranking.sort(this.compareVotes).reverse();
    ranking.map((project, index) => (project.rank = index + 1));
    return ranking;
  }

  compareVotes(a, b) {
    if (a.votes < b.votes) return -1;
    if (a.votes > b.votes) return 1;
    return 0;
  }

  compareTitle(a, b) {
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  }

  sortProjectsByVotes(projects) {
    const ranking = this.rank(projects);
    if (this.state.asc === true) {
      ranking.sort(this.compareVotes).reverse();
      this.setState({ ranking: ranking });
      this.setState({ asc: false });
      this.setState({ alph: false });
    } else {
      ranking.sort(this.compareVotes);
      this.setState({ ranking: ranking });
      this.setState({ asc: true });
      this.setState({ alph: false });
    }
  }

  sortProjectsByTitle(projects) {
    const ranking = this.rank(projects);
    if (this.state.alph === true) {
      ranking.sort(this.compareTitle).reverse();
      this.setState({ ranking: ranking });
      this.setState({ alph: false });
      this.setState({ asc: true });
    } else {
      ranking.sort(this.compareTitle);
      this.setState({ ranking: ranking });
      this.setState({ alph: true });
      this.setState({ asc: true });
    }
  }

  filterRank(e, projects) {
    const ranking = this.rank(projects);
    const newRanking = [];
    const inputLength = e.target.value.length;
    for (var i = 0; i < ranking.length; i++) {
      const str = ranking[i].title.slice(0, inputLength).toLowerCase();
      if (str === e.target.value.toLowerCase()) {
        newRanking.push(ranking[i]);
      }
    }
    newRanking.sort(this.compareVotes).reverse();
    this.setState({ ranking: newRanking });
  }

  updateWith() {
    return ['projects'];
  }

  render() {
    return (
      <Table className="m-3" style={{ width: '50%' }}>
        <tbody>
          <tr>
            <td colSpan="3">
              <InputGroup>
                <FormControl
                  placeholder="Search"
                  onChange={(e) =>
                    this.filterRank(e, this.centralState.projects)
                  }
                />
              </InputGroup>
            </td>
          </tr>
          <tr style={{ cursor: 'pointer' }}>
            <td
              onClick={() =>
                this.sortProjectsByVotes(this.centralState.projects)
              }
            >
              {' '}
              Rank{' '}
            </td>
            <td
              onClick={() =>
                this.sortProjectsByTitle(this.centralState.projects)
              }
            >
              {' '}
              Title{' '}
            </td>
            <td
              onClick={() =>
                this.sortProjectsByVotes(this.centralState.projects)
              }
            >
              {' '}
              Votes{' '}
            </td>
          </tr>
          {this.state.ranking === []
            ? this.rankDefault(this.centralState.projects).map((project) => (
                <LeaderboardRow
                  key={project.id}
                  rank={project.rank}
                  project={project}
                />
              ))
            : this.state.ranking.map((project) => (
                <LeaderboardRow
                  key={project.id}
                  rank={project.rank}
                  project={project}
                />
              ))}
        </tbody>
      </Table>
    );
  }
}
export default CSComponent(LeaderboardTable);
