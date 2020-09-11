import React from 'react';

import Header from '../components/Header';
import LeaderboardTable from '../components/LeaderboardTable';
import LeaderboardNotice from '../components/LeaderboardNotice';

class Leaderboard extends React.Component {
  render() {
    return (
      <>
        <Header />
        <div>
          <LeaderboardNotice />
          <h1 className="m-3" style={{ display: 'flex', justifyContent: 'center' }}>
            Leaderboard
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <LeaderboardTable />
          </div>
          <div className="my-5" />
        </div>
      </>
    );
  }
}

export default Leaderboard;
