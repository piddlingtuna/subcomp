import React from 'react';

import loadingGif from '../assets/img/loading.gif';
import Header from '../components/Header';
import { getComic } from '../calls';

class NotFound extends React.Component {
  componentDidMount() {
    getComic()
      .then(result => {
        this.setState({
          title: result.title,
          comic: result.comic,
        })
      })
  }

  render() {
    return (
      <>
        <Header />
        <h1 className="m-3" style={{ display: 'flex', justifyContent: 'center'}}>404 Page Not Found</h1>
        { 
          this.state === null &&
          <img src={loadingGif} alt='loading' style={{ display: 'block', margin: '0 auto'}} />
        }
        {
          this.state !== null &&
          <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <p style={{ textAlign: 'center', width: '50%' }}>{this.state.title}</p>
            </div>
            <img src={this.state.comic} alt='comic' style={{ display: 'block', margin: '0 auto'}} />
          </div>
        }
      </>
    );
  }
}

export default NotFound;
