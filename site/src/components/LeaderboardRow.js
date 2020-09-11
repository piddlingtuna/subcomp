import React from 'react';

import ProjectModal from './ProjectModal';

class LeaderboardRow extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
    }
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen() {
    this.setState({
      show: true,
    })
  }

  handleClose() {
    this.setState({
      show: false,
    })
  }

  render() {
    return (
      <>
        <tr key={this.props.project.id} style={{ cursor: 'pointer' }} onClick={this.handleOpen}>
          <td>{ this.props.rank }</td>
          <td>{ this.props.project.title }</td>
          <td>{ this.props.project.votes }</td>
        </tr>
        <ProjectModal show={this.state.show} handleClose={this.handleClose} project={this.props.project} />
      </>
    );
  }
}

export default LeaderboardRow;
