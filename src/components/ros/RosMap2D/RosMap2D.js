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

const style = {
    backgroundColor: "rgb(28, 42, 53)",
    width: "100%",
    height: "100%"
};

class RosMap2D extends React.Component {
    constructor(props) {
        super(props);
        this.navId = "id_"+props.id;
        if (props.ros) {
            this.ros = props.ros;
        }
    }

    showMap = () => {
        const ros = (this.ros)? this.ros: new ROSLIB.Ros({
            url: 'ws://0.0.0.0:9090'
        });

        let navSelector = $("#"+this.navId);
        let height = navSelector.height() * 1;
        let width = navSelector.width() * 1;

        console.log('789456 h:', height, ' w:', width);

        console.log('h:',height,' w:',width);

        // Create the main viewer.
        var viewer = new ROS2D.Viewer({
            divID: this.navId,
            width: width,
            height: height
        });

        // var viewer = new ROS2D.Viewer({
        //     divID: 'nav',
        //     width: $("nav").closest(".map").width(),
        //     height: $("nav").closest(".map").height()
        // });

        // Setup the nav client.
        var nav = NAV2D.OccupancyGridClientNav({
            ros: ros,
            rootObject: viewer.scene,
            viewer: viewer,
            serverName: '/map'
        });
    };

    componentDidMount() {
        this.showMap();

    }

    render() {
        return <div id={this.navId} className="rosmap2d" style={style}>
        </div>;
    }
}

export default RosMap2D;
