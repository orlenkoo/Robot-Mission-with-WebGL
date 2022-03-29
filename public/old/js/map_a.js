var ros = null;
$(document).ready(function () {
    /**
     * Setup all GUI elements when the page is loaded.
     */

    // Connect to ROS.
    ros = new ROSLIB.Ros({
            url: 'ws://0.0.0.0:9090'
    });

    let navSelector = $("#nav");
    let height = navSelector.closest(".map").height()*1;
    let width = navSelector.closest(".map").width()*1;

    console.log('h:',height,' w:',width);

    // Create the main viewer.
    var viewer = new ROS2D.Viewer({
        divID: 'nav',
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


});

