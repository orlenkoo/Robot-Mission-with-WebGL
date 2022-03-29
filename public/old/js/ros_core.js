$(document).ready(function () {
    /**
     * Setup all GUI elements when the page is loaded.
     */

        // Connect to ROS.
    /*var ros = new ROSLIB.Ros({
        url: 'ws://0.0.0.0:9090'
    });*/

    ros.on('connection', function() {
        console.log("Connected");
        $('#system-status-val').text("Connected");
    });

    ros.on('error', function(error) {
        console.log("Connection Error: "+error);
        $('#system-status-val').text("Connection Error");
    });

    ros.on('close', function() {
        console.log("Connection Closed");
        $('#system-status-val').text("Connection Closed");
    });

    /*
    FOR LISTENING TO A TOPIC
    var txt_listener = new ROSLIB.Topic({
        ros : ros,
        name : '/txt_msg',
        messageType : 'std_msgs/String'
    });

    txt_listener.subscribe(function(m) {
        document.getElementById("msg").innerHTML = m.data;
    });
    */

    let cmd_vel_listener = new ROSLIB.Topic({
        ros : ros,
        name : "/cmd_vel",
        messageType : 'geometry_msgs/Twist'
    });


    let createJoystick = function () {
        var options = {
            zone: document.getElementById('zone_joystick'),
            threshold: 0.1,
            position: { left: 50 + '%' },
            mode: 'static',
            size: 130,
            color: '#e6c7ff',
        };

        manager = nipplejs.create(options);

        linear_speed = 0;
        angular_speed = 0;

        self.manager.on('start', function (event, nipple) {
            console.log("Movement start");
        });

        self.manager.on('move', function (event, nipple) {
            console.log("Moving");
        });

        self.manager.on('end', function () {
            console.log("Movement end");
        });

        manager.on('start', function (event, nipple) {
            timer = setInterval(function () {
                move(linear_speed, angular_speed);
            }, 25);
        });

        manager.on('end', function () {
            if (timer) {
                clearInterval(timer);
            }
            move(0, 0);
        });

        manager.on('move', function (event, nipple) {
            max_linear = 5.0; // m/s
            max_angular = 2.0; // rad/s
            max_distance = 75.0; // pixels;
            linear_speed = Math.sin(nipple.angle.radian) * max_linear * nipple.distance/max_distance;
            angular_speed = -Math.cos(nipple.angle.radian) * max_angular * nipple.distance/max_distance;
        });

    };

    createJoystick();

    let move = function (linear, angular) {
        var twist = new ROSLIB.Message({
            linear: {
                x: linear,
                y: 0,
                z: 0
            },
            angular: {
                x: 0,
                y: 0,
                z: angular
            }
        });
        cmd_vel_listener.publish(twist);
    };


    $('.start-btn').click(function () {
        // alert('Start');
        move(linear_speed, angular_speed);
    });


    $('.stop-btn').click(function () {

        move(0,0)
        // alert('Stop');
    });

});

