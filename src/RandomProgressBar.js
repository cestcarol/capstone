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
    setInterval(() => setCompleted(Math.floor(Math.random() * 100) + 1), 2000);
  }, []);

  return (
    <div className="Foo">
      <ProgressBar bgcolor={"#6a1b9a"} completed={completed} />
    </div>
  );
}

export default RandomProgressBar;