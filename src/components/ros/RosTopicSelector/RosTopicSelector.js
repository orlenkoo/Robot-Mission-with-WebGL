import React from 'react';
import './styles.css';
import {Image, Row, Col, Select } from 'antd';
import $ from "jquery";

const { Option } = Select;

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

class RosTopicSelector extends React.Component {
    state = {
        topicList: []
    };

    constructor(props) {
        super(props);
        this.navId = "id_"+props.id;

        if (props.ros) {
            this.ros = props.ros;
        }
    }

    handleChange = (value) => {
        const { onSelect } = this.props;
        console.log(`selected ${value}`);

        if (onSelect) {
            onSelect(value);
        }
    };

    componentDidMount() {
        const ros = (this.ros)? this.ros: new ROSLIB.Ros({
            url: 'ws://0.0.0.0:9090'
        });

        let navSelector = $("#"+this.navId);
        let height = navSelector.height() * 1;
        let width = navSelector.width() * 1;

        this.setState({
            width,
            topicList: [
                "/artic/detection",
                "/camera/color/camera_info",
                "/camera/color/image_raw",
                "/camera/color/image_raw/compressedDepth",
                "/camera/color/image_raw/theora",
                "/camera/depth/camera_info",
                "/camera/depth/color/points",
                "/camera/depth/image_rect_raw",
                "/camera/depth/image_rect_raw/compressed",
                "/camera/depth/image_rect_raw/compressedDepth",
                "/camera/depth/image_rect_raw/theora",
                "/camera/extrinsics/depth_to_color"
            ]
        })

    }

    render() {
        const {
            topicList,
            width
        } = this.state;

        return <div  id={this.navId} >
            <Select style={{ width }}  onChange={this.handleChange}>
                {
                    topicList.map((topic)=> {
                        return <Option value={topic}>{topic}</Option>
                    })
                }

            </Select>
        </div>;
    }
}

export default RosTopicSelector;
