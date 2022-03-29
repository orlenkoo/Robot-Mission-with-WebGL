import React from 'react';
import './styles.css';
import {Image, Row, Col} from 'antd';
import $ from "jquery";
import PropTypes from 'prop-types';

const {
    ROS2D,
    ROSLIB,
    ROS3D,
    NAV2D,
    MJPEGCANVAS
} = window;

const style = {
    backgroundColor: "rgb(28, 42, 53)",
    width: "100%",
    height: "100%"
};

class RosCam extends React.Component {
    constructor(props) {
        super(props);
        this.navId = "id_"+props.id;
        if (props.ros) {
            this.ros = props.ros;
        }
    }

    propTypes = {
        topic: PropTypes.string
    };

    componentDidMount() {
        const { topic } = this.props;

        const ros = (this.ros)? this.ros: new ROSLIB.Ros({
            url: 'ws://0.0.0.0:9090'
        });

        let navSelector = $("#"+this.navId);
        let height = navSelector.height() * 1;
        let width = navSelector.width() * 1;

        console.log('789456 h:', height, ' w:', width);

        console.log('h:',height,' w:',width);

        var viewer2 = new MJPEGCANVAS.Viewer({
            divID : this.navId,
            host : 'localhost',
            width,
            height,
            topic
        });

    }

    render() {
        return <div id={this.navId} className="roscam" style={style}>
        </div>;
    }
}

export default RosCam;
