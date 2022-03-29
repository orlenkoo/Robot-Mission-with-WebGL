$(document).ready(function () {
    /**
     * Setup all GUI elements when the page is loaded.
     */

        // Connect to ROS.
    var ros = new ROSLIB.Ros({
        url: 'ws://52.15.207.12:9090'
    });

    // Create the main viewer.
    var viewer = new ROS2D.Viewer({
        divID: 'nav',
        width: 750,
        height: 200
    });

    // Setup the nav client.
    var nav = NAV2D.OccupancyGridClientNav({
        ros: ros,
        rootObject: viewer.scene,
        viewer: viewer,
        serverName: '/map'
    });


});

