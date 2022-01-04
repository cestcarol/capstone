import React,  { useState, useEffect } from 'react';


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

/*TODO resolve memory leak:
	can be reproduce by starting the app in a web browser then, refreshing with alt+F5

Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
RandomProgressBar@http://localhost:3000/static/js/main.chunk.js:713:91
*/

function RandomProgressBar() {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    setInterval(() => setCompleted(Math.floor(Math.random() * 100) + 1), 2000);
  }, []);

  return (
    <div className="progressBar">
      <ProgressBar bgcolor={"#6a1b9a"} completed={completed} />
    </div>
  );
}

export default RandomProgressBar;