import React from 'react';
import ResponsiveViewer from './index';
import { Table, Tag, Space } from 'antd';

export default {
	title: 'Responsive Viewer',
	component: ResponsiveViewer,
};

export let ZeroConfig = () => {
	return <ResponsiveViewer />;
};

function between(x, a, b) {
	return x > a && x < b;
}

export let ResponsiveTest = () => {

	const render = (height, width) => {
		if (width < 567) {
			return <h1>Xtra Small</h1>;
		} else if (between(width, 576, 768)) {
			return <h1>Small</h1>;
		} else if (between(width, 768, 992)) {
			return <h1>Medium</h1>;
		} else if (between(width, 992, 1200)) {
			return <h1>Large</h1>;
		} else {
			return <h1>Xtra Large</h1>;
		}
	};

	return <ResponsiveViewer render={render} />;
};
