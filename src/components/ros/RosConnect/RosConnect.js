import React from 'react';
import './styles.css';
import {Image, Row, Col} from 'antd';
import $ from "jquery";

const {
    ROS2D,
    ROSLIB,
    ROS3D,
    NAV2D
} = window;

class RosConnect extends React.Component {
    constructor(props) {
        super(props);
    }

    connectRos = (url, cb) => {

        if (!url) {
            url = "ws://0.0.0.0:9090";
        }


        const ros = new ROSLIB.Ros({
            url
        });

        ros.on('connection', function() {
            console.log("Connected");
            $('#system-status-val').text("Connected");
            if (cb) cb(true, "Connected", ros);
        });

        ros.on('error', function(error) {
            console.log("Connection Error: ",error);
            $('#system-status-val').text("Connection Error");
            if (cb) cb(false, "Connection Error", ros);
        });

        ros.on('close', function() {
            console.log("Connection Closed");
            $('#system-status-val').text("Connection Closed");
            if (cb) cb(false, "Connection Closed", ros);
        });
    };

    componentDidMount() {
        const {callback, url} = this.props;
        this.connectRos(url, callback)
    }

    render() {
        const {defaultText} = this.props;
        return <div id={"system-status-val"}>{defaultText}</div>;
    }
}

export default RosConnect;
