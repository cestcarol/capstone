import { Handle } from 'react-flow-renderer';

//import RandomProgressBar from './RandomProgressBar';

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
				position="top"
				style={{ borderRadius: 0 }} />
			<div>{data.label}</div>

			<div>{data.text}</div>
			{ /* <RandomProgressBar /> */ }
			<Handle
				type="target"
				position="bottom"
				style={{ top: '100%', borderRadius: 0 }} />
		</div>
	);
};

export default CustomNodeComponent;