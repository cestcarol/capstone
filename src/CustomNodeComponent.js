import { Handle } from 'react-flow-renderer';

import RandomProgressBar from './RandomProgressBar';

const customNodeStyles = {
	background: '#9CA8B3',
	color: '#FFF',
	padding: 10,
};

const CustomNodeComponent = ({ data }) => {

	return (
		<div style={customNodeStyles}>
			<Handle
				type="source"
				position="bottom"
				style={{ opacity: 0.0 }} />
			<div>{data.label}</div>
			<div>{data.text}</div>
			{  <RandomProgressBar />  }
			<div>lastRead : {data.lastRead}</div>
			<div>cardinality : {data.cardinality}</div>
			<div>consumed : {data.consumed}</div>	
			<Handle
				type="target"
				position="top"
				style={{ opacity: 0.0 }} />
		</div>
	);
};

export default CustomNodeComponent;