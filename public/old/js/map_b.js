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
    var viewer = new ROS3D.Viewer({
        divID : 'nav',
        width : width,
        height : height,
        antialias : true
    });

    // Add a grid.
    viewer.addObject(new ROS3D.Grid());

    // Setup a client to listen to TFs.
    var tfClient = new ROSLIB.TFClient({
        ros : ros,
        angularThres : 0.01,
        transThres : 0.01,
        rate : 10.0
    });

    // Setup the URDF client.
    var urdfClient = new ROS3D.UrdfClient({
        ros : ros,
        tfClient : tfClient,
        path : 'http://resources.robotwebtools.org/',
        rootObject : viewer.scene,
        loader : ROS3D.COLLADA_LOADER_2
    });

});

