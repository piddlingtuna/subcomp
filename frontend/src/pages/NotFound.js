import React, { useEffect, useState } from "react";

import loadingGif from "../assets/img/loading.gif";
import Header from "../components/Header";
import { getComic } from "../calls";

const NotFound = () => {
  const [state, setState] = useState({});

  useEffect(() => {
    getComic().then((result) => {
      setState({
        title: result.title,
        comic: result.comic,
      });
    });
  }, []);

  return (
    <>
      <Header />
      <h1 className="m-3" style={{ display: "flex", justifyContent: "center" }}>
        404 Page Not Found
      </h1>
      {state === null && (
        <img
          src={loadingGif}
          alt="loading"
          style={{ display: "block", margin: "0 auto" }}
        />
      )}
      {state !== null && (
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <p style={{ textAlign: "center", width: "50%" }}>{state.title}</p>
          </div>
          <img
            src={state.comic}
            alt="comic"
            style={{ display: "block", margin: "0 auto" }}
          />
        </div>
      )}
    </>
  );
};

export default NotFound;
