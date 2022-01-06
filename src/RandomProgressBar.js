import React, { useState, useEffect } from 'react';


const ProgressBar = (props) => {
  const { bgcolor, completed } = props;

  const containerStyles = {
    height: 20,
    width: "80%",
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    margin: 20,
  };

  const fillerStyles = {
    height: "100%",
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: "inherit",
    textAlign: "right",
    transition: 'width 1s ease-in-out',
  };

  const labelStyles = {
    padding: 5,
    color: "white",
    fontWeight: "bold",
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${completed}%`}</span>
      </div>
    </div>
  );
};

function RandomProgressBar() {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(
      () => setCompleted(Math.floor(Math.random() * 100) + 1)
      , 2000);
    return () => {
      /* cleanup required when unmounting
        This resolve the memory leak when removing/unmounting a Node with a ProgressBar
      */
      clearInterval(intervalId);
    }
  }, [completed]);


  return (
    <div className="progressBar">
      <ProgressBar bgcolor={"#6a1b9a"} completed={completed} />
    </div>
  );
}

export default RandomProgressBar;