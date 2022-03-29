import React from 'react';
import './styles.css';
import {Image, Row, Col} from 'antd';
import $ from "jquery";

class RosJoyStick extends React.Component {
    constructor(props) {
        super(props);
    }

    createJoystick = function () {
        let {
            nipplejs,
        } = window;

        const self = this;

        var options = {
            zone: document.getElementById('zone_joystick'),
            threshold: 0.1,
            position: { left: 50 + '%' },
            mode: 'static',
            size: 130,
            color: '#e6c7ff',
        };

        self.manager = nipplejs.create(options);

        let linear_speed = 0;
        let angular_speed = 0;

        self.manager.on('start', function (event, nipple) {
            console.log("Movement start");
        });

        self.manager.on('move', function (event, nipple) {
            console.log("Moving");
        });

        self.manager.on('end', function () {
            console.log("Movement end");
        });

        let timer = null;
        self.manager.on('start', (event, nipple) => {
            timer = setInterval(function () {
                self.move(linear_speed, angular_speed);
            }, 25);
        });

        self.manager.on('end', () => {
            if (timer) {
                clearInterval(timer);
            }
            self.move(0, 0);
        });

        self.manager.on('move', function (event, nipple) {
            let max_linear = 5.0; // m/s
            let max_angular = 2.0; // rad/s
            let max_distance = 75.0; // pixels;
            linear_speed = Math.sin(nipple.angle.radian) * max_linear * nipple.distance/max_distance;
            angular_speed = -Math.cos(nipple.angle.radian) * max_angular * nipple.distance/max_distance;
        });

    };

    move = function (linear, angular) {
        const {
            onMove
        } = this.props;

        if (onMove) {
            onMove(linear, angular)
        }
    };

    componentDidMount() {
        this.createJoystick();
    }

    render() {
        return <div style={this.props.style} id={"zone_joystick"}></div>;
    }
}

export default RosJoyStick;
