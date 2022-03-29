$(document).ready(function () {
    /**
     * Setup all GUI elements when the page is loaded.
     */

        // Connect to ROS.
    var ros = new ROSLIB.Ros({
        url: 'ws://0.0.0.0:9090'
    });

    ros.on('connection', function() {
        console.log("Ros Cam Connected");
    });

    ros.on('error', function(error) {
        console.log("Ros Cam Connection Error: "+error);
    });

    ros.on('close', function() {
        console.log("Ros Cam Connection Closed");
    });

    // Create the main viewer.
    var viewer = new ROS3D.Viewer({
        divID : 'viewer',
        width : $('#viewer').width(),
        height : $('#viewer').height(),
        antialias : true
    });

    // Setup a client to listen to TFs.
    var tfClient = new ROSLIB.TFClient({
        ros : ros,
        angularThres : 0.01,
        transThres : 0.01,
        rate : 10.0,
        fixedFrame : '/camera_link'
    });

    // Setup Kinect DepthCloud stream
    depthCloud = new ROS3D.DepthCloud({
        url : 'http://'+window.location.hostname + ':9999/streams/depthcloud_encoded.webm',
        f : 525.0
    });
    depthCloud.startStream();

    // Create Kinect scene node
    var kinectNode = new ROS3D.SceneNode({
        frameID : '/camera_rgb_optical_frame',
        tfClient : tfClient,
        object : depthCloud
    });
    viewer.scene.add(kinectNode);

});

