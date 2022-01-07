import { Handle } from 'react-flow-renderer';

import RandomProgressBar from './RandomProgressBar';

const customNodeStyles = {
	background: '#9CA8B3',
	color: '#FFF',
	width:'150px',
	padding: 5,
	border: '2px solid black',
	borderRadius: 12,
};

const CustomNodeComponent = ({ data }) => {

	return (
		<div style={customNodeStyles}>
			<Handle
				type="source"
				position="bottom"
				style={{ opacity: 0.0 }} />
			<div>{data.label}</div>

			<h4>{data.text}</h4>
			{  <RandomProgressBar />  }

			<div>lastRead : {data.lastRead}</div>
			<div>cardinality : {data.cardinality}</div>
			<div>consumed : {data.consumed}</div>
			<div>Current 'o?' : {data.lastSeen}</div>

			<Handle
				type="target"
				position="top"
				style={{ opacity: 0.0 }} />
		</div>
	);
};

export default CustomNodeComponent;
