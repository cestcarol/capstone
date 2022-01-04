import React, { useState, setState, useEffect } from 'react';
import ReactFlow, { Handle } from 'react-flow-renderer';

import RandomProgressBar from './RandomProgressBar';

const CustomNodeComponent = ({ data }) => {
    return (
		<div className={data.className}>
		  <Handle type="target" position="left" style={{ borderRadius: 0 }} />
			<div>{data.text}</div>
			{/* <RandomProgressBar /> */}
			<b> Bidule! </b> 
			<Handle
				type="source"
				position="right"
				id="a"
				style={{ top: '30%', borderRadius: 0 }}
			/>
			<Handle
				type="source"
				position="right"
				id="b"
				style={{ top: '70%', borderRadius: 0 }}
			/>
		</div>

	);
};

export default CustomNodeComponent ;
