$(document).ready(function () {

    console.log("Connecting to rosbridge.");

    /*var ros = new ROSLIB.Ros({
        url : 'ws://0.0.0.0:9090'
    });*/

    // This function is called upon the rosbridge connection event
    ros.on('connection', function() {

    });

    // This function is called when there is an error attempting to connect to rosbridge
    ros.on('error', function(error) {

    });

// This function is called when the connection to rosbridge is closed
    ros.on('close', function() {

    });

    /* Publisher and Subscriber Page 2 --->  */
    /* SAVE MAP PUBLISHER */
    $('.save-map').click(function () {
        alert("Saving Map");
        var topic = new ROSLIB.Topic({
            ros : ros,
            name : '/turtle1/cmd_vel',
            messageType : 'geometry_msgs/Twist'
        });
        var message = new ROSLIB.Message({});
        topic.publish(message)
    });



    /* ADD WAYPOINT PUBLISHER */
    $('.add-waypoint').click(function () {
        alert("Adding Waypoint");
        var topic = new ROSLIB.Topic({
            ros : ros,
            name : '/turtle1/cmd_vel',
            messageType : 'geometry_msgs/Twist'
        });
        var message = new ROSLIB.Message({});
        topic.publish(message)
    });

    /* DELETE WAYPOINT PUBLISHER */
    $('.delete-waypoint').click(function () {
        alert("Deleting Waypoint");
        var topic = new ROSLIB.Topic({
            ros : ros,
            name : '/turtle1/cmd_vel',
            messageType : 'geometry_msgs/Twist'
        });
        var message = new ROSLIB.Message({});
        topic.publish(message)
    });

    /* <--- Publisher and Subscriber Page 2*/

});

