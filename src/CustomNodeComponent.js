import { Handle } from 'react-flow-renderer';

import RandomProgressBar from './RandomProgressBar';

const customNodeStyles = {
	background: '#9CA8B3',
	color: '#000000',
	width:'150px',
	padding: 5,
	border: '1px solid black',
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
			<div>lastRead : <i>{data.lastRead}</i></div>
			<div>cardinality : <i>{data.cardinality}</i></div>
			<div>consumed : <i>{data.consumed}</i></div>
			<Handle
				type="target"
				position="top"
				style={{ opacity: 0.0 }} />
		</div>
	);
};

export default CustomNodeComponent;
