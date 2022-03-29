import React from 'react';
import '../RosMap2D/styles.css';
import {Image, Row, Col} from 'antd';
import $ from "jquery";
import PropTypes from 'prop-types';

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

class GridMap3D extends React.Component {
    constructor(props) {
        super(props);
        this.navId = "id_"+props.id;
        if (props.ros) {
            this.ros = props.ros;
        }
    }

    propTypes = {
        ros: PropTypes.object,
        id: PropTypes.string,
        gridVisibility: PropTypes.bool,
        gridColor: PropTypes.string,
        gridNumCells: PropTypes.number,
        odomVisibility: PropTypes.bool
    };

    viewer = null;

    addMarker = (markerMessage)=> {
        var marker = new ROS3D.Marker({
            path: null,
            message: markerMessage
        });

        this.viewer.addObject(marker);


        /*const markerMessage = {};
        markerMessage.header = {};
        markerMessage.header.frame_id = "base_link";
        markerMessage.ns = "my_namespace";
        markerMessage.id = 0;
        markerMessage.type = 1;
        markerMessage.pose = { position: {}, orientation: {} };
        markerMessage.pose.position.x = 1;
        markerMessage.pose.position.y = 1;
        markerMessage.pose.position.z = 1;
        markerMessage.pose.orientation.x = 0.0;
        markerMessage.pose.orientation.y = 0.0;
        markerMessage.pose.orientation.z = 0.0;
        markerMessage.pose.orientation.w = 0.0;
        markerMessage.scale = {};
        markerMessage.scale.x = 0.1;
        markerMessage.scale.y = 0.1;
        markerMessage.scale.z = 0.1;
        markerMessage.color = {}; // Don't forget to set the alpha!
        markerMessage.color.a = 1.0; // Don't forget to set the alpha!
        markerMessage.color.r = 0.0;
        markerMessage.color.g = 1.0;
        markerMessage.color.b = 0.0;*/


    };

    componentDidMount() {
        const {
            gridVisibility,
            gridColor,
            gridNumCells,
            odomVisibility
        } = this.props;

        const ros = (this.ros)? this.ros: new ROSLIB.Ros({
            url: 'ws://0.0.0.0:9090'
        });

        let navSelector = $("#"+this.navId);
        let height = navSelector.height() * 1;
        let width = navSelector.width() * 1;

        console.log('789456 h:', height, ' w:', width);

        // Create the main viewer.
        var viewer = new ROS3D.Viewer({
            divID: this.navId,
            width: width,
            height: height,
            antialias: true,
            cameraPose: {
                x : 0,
                y : 0,
                z : 80
            }
        });

        this.viewer = viewer;


        // Setup the map client.
        var gridClient = new ROS3D.OccupancyGridClient({
            ros : ros,
            rootObject : viewer.scene,
            continuous: true
        });

        if (gridVisibility) {
            var grid = new ROS3D.Grid({
                color:  (gridColor)? gridColor : "#2fff00",
                num_cells: (gridNumCells)? gridNumCells :  10
            });

            viewer.addObject(grid);
        }

       /* var mouseHandler = new ROS3D.MouseHandler({
            rootObject : viewer.scene,
            renderer: viewer.renderer,
            camera: viewer.camera,
            fallbackTarget: viewer.fallbackTarget
        });

        mouseHandler.no*/

        if (odomVisibility) {
            let last_x_pos = 0;

            try {
                const getOdomMarker = (pose)=> {
                    console.log("pose", pose);

                    /*const markerMessage = {};
                    markerMessage.header = {};
                    markerMessage.header.frame_id = "base_link";
                    markerMessage.ns = "my_namespace";
                    markerMessage.id = 0;
                    markerMessage.type = 0;
                    markerMessage.pose = pose;

                    markerMessage.points = [
                        {
                            x: pose.position.x,
                            y: pose.position.y,
                            z: pose.position.z
                        }, {
                            x: last_x_pos*1,
                            y: 0,
                            z: 0,
                        }
                    ];
                    markerMessage.scale = {};

                    markerMessage.scale.x = 0.1;
                    markerMessage.scale.y = 0.2;
                    markerMessage.scale.z = 0.2;
                    markerMessage.color = {}; // Don't forget to set the alpha!
                    markerMessage.color.a = 1.0; // Don't forget to set the alpha!
                    markerMessage.color.r = 1.0;
                    markerMessage.color.g = 0.0;
                    markerMessage.color.b = 0.0;*/

                    const markerMessage = {};
                    markerMessage.header = {};
                    markerMessage.header.frame_id = "base_link";
                    markerMessage.ns = "my_namespace";
                    markerMessage.id = 0;
                    markerMessage.type = 2;
                    markerMessage.pose = { position: {}, orientation: {} };
                    markerMessage.pose.position.x = pose.position.x;
                    markerMessage.pose.position.y = pose.position.y;
                    markerMessage.pose.position.z = pose.position.z;
                    markerMessage.pose.orientation.x = 0.0;
                    markerMessage.pose.orientation.y = 0.0;
                    markerMessage.pose.orientation.z = 0.0;
                    markerMessage.pose.orientation.w = 0.0;
                    markerMessage.scale = {};
                    markerMessage.scale.x = 0.3;
                    markerMessage.scale.y = 0.3;
                    markerMessage.scale.z = 0.3;
                    markerMessage.color = {}; // Don't forget to set the alpha!
                    markerMessage.color.a = 1.0; // Don't forget to set the alpha!
                    markerMessage.color.r = 1.0;
                    markerMessage.color.g = 0.0;
                    markerMessage.color.b = 0.0;
                    console.log("Adding", markerMessage);

                    return markerMessage;
                };

                /* ODOM RELATED CODE ==> */
                let topice = new ROSLIB.Topic({
                    ros: this.ros,
                    name: '/odom_raw',
                    messageType: 'nav_msgs/msg/Odometry'
                });

                let i = 0;

                let isLog = false;

                setInterval(()=>{
                    isLog = !isLog;
                    setTimeout(()=>{
                        isLog = false;
                    },50)
                }, 500);

                topice.subscribe((odom_message) => {
                    console.log("789456 odom_message", odom_message);
                    if (isLog) {
                        console.log("odom_message", odom_message);
                    }
                    // console.log(message.pose.pose);
                    if (isLog) {
                        i++;

                        console.log((JSON.stringify(odom_message)));
                        const message = getOdomMarker((JSON.parse(JSON.stringify(odom_message))).pose.pose);
                        console.log(" marker message", message);

                        let markers = new ROS3D.Marker({
                            path: null,
                            message
                        });

                        viewer.addObject(markers);
                    }


                });
                /* <== ODOM */

                document.getElementById(this.navId).addEventListener('mousedown', (e) => {
                    console.log("Mouse Down")
                });

                document.getElementById(this.navId).addEventListener('mouseup', (e) => {
                    console.log("Mouse Up")
                });

                const x1 = 331;
                const y1 = 224;
                const x2 = 728;
                const y2 = 418;

                function printMousePos(event) {
                    console.log( event.clientX, event.clientY);
                }

                document.addEventListener("click", printMousePos);
                setTimeout(()=> {
                    console.log("Starting the event");
                    var element1 = document.elementFromPoint(x1, y1);
                    var element2 = document.elementFromPoint(x2, y2);

                    element1.dispatchEvent(new Event('mousedown'));
                    $(element1).trigger('mousemove');
                    element2.dispatchEvent(new Event('mousedown'));

                    element2.dispatchEvent(new Event('mouseup'));

                    /*element.dispatchEvent(new Event('mouseup'));
                    element.dispatchEvent(new Event('click'));*/
                }, 3000);

            } catch (e) {
                console.log("Odom Error: ",e);
            }
        }



    }

    render() {
        return <div id={this.navId} className="gridmap3ddiv" style={style}>
        </div>;
    }
}

export default GridMap3D;
