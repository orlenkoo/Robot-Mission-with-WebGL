import React from 'react';
import defaultConfigs from './defaultConfigs';
import { object, string, func, array } from 'prop-types';
import './style.less';
import ReactResizeDetector from 'react-resize-detector';

/** ResponsiveViewer is a component for responsiveness of a component*/
export default class ResponsiveViewer extends React.Component {
	static defaultProps = {
		...defaultConfigs,
	};

	static propTypes = {
		/** Render  */
		render: func,
	};

	constructor(props) {
		super(props);
		this.state = {
			width: window.innerWidth,
			height: window.innerHeight,
		};
	}
	onResize = (width, height) => {
		this.setState({ width, height });
	};

	render() {
		if (!this.props.render) {
			return <div></div>;
		}
		return (
			<div>
				<ReactResizeDetector
					handleWidth
					handleHeight
					refreshMode="debounce"
					refreshRate={200}
					onResize={this.onResize}
				/>
				{this.props.render(this.state.height, this.state.width)}
			</div>
		);
	}
}
