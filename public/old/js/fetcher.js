$(document).ready(function () {
    /* VARIABLES */
    let storedMissionsList = [];
    let selectedMissionId = '';
    let selectedMissionJson = {};

    let orderedMissionList = [];
    /* - - - - -- - - - - */

    $('.confloading').hide();

    $("#dialog-waypoint, #dialog-action, #dialog-transition, #dialog-loop, #dialog-command").dialog({
        autoOpen: false,
        draggable: true,
        width: 400,
        show: {
            duration: 150
        },
        hide: {
            duration: 100
        }
    }).prev(".ui-dialog-titlebar").css("background", "#1c2a35").prev(".ui-widget-header").css("background", "");
    $("#dialog-mission-order").dialog({
        autoOpen: false,
        draggable: true,
        show: {
            duration: 150
        },
        hide: {
            duration: 100
        }
    }).prev(".ui-dialog-titlebar").css("background", "#1c2a35").prev(".ui-widget-header").css("background", "");

    /* FUNCTIONS */
    // storedmission-list

    let getAllStoredMissions = function (cb) {
        $.post("/GetAllStoredMissions", {},
            function (data, status) {
                console.log(data);

                let storedmissionHtml = '';

                let i = 0;
                storedMissionsList = data;
                data.forEach(function (mission) {
                    i++;
                    if (i > 0) storedmissionHtml
                        += '<tr class="missionlistitem" mission_id="' + mission.mission_id + '">' +
                        '<td>' + mission.mission_name + '</td> ' +
                        '<td>' + mission.map_name + '</td> ' +
                        '<td>' + mission.building_name + '</td> ' +
                        // '<td mission_conf="'+mission.mission_conf+'"><input type="checkbox"></td> ' +
                        '</tr>'
                });

                $('.storedmission-list').html(storedmissionHtml);

                let orderedmissionHtml = '';

                i = 0;
                orderedMissionsList = data;
                data.forEach(function (mission) {
                    i++;
                    if (i > 0) orderedmissionHtml
                        += '<tr scope="col" mission_id="' + mission.mission_id + '">' +
                        '<td scope="col" class="mission_conf" mission_conf="' + mission.mission_conf + '"><input class="ordercheckbox" mission_id="' + mission.mission_id + '"  mission_conf="' + mission.mission_conf + '" type="checkbox"></td> ' +
                        '<td scope="col">' + mission.mission_name + '</td> ' +
                        // '<td scope="col">' + mission.map_name + '</td> ' +
                        // '<td scope="col">' + mission.building_name + '</td> ' +
                        '</tr>'
                });

                $('.orderedmission-list').html(orderedmissionHtml);

                if (cb) cb();
            });
    };

    getAllStoredMissions();

    let robotCreateMission = function (reqObj, cb) {
        $.post("/RobotCreateMission", reqObj,
            function (data, status) {
                console.log(data);
                if (cb) cb();
            });
    };

    let displayMissionConfiguration = function () {
        // { "mission_conf_arr": "", "mission_conf": ""}
        let configHtml = '';
        if (selectedMissionJson.mission_conf_arr == '') selectedMissionJson.mission_conf_arr = [];
        if (selectedMissionJson.mission_conf_arr == null) selectedMissionJson.mission_conf_arr = [];
        let configurationList = selectedMissionJson.mission_conf_arr;

        for (let i = 0; i < configurationList.length; i++) {
            configHtml += '<h2>' + configurationList[i]['NAME'] + '</h2>';
        }

        if (configHtml == '') configHtml = '<h2>Not Yet Configured</h2>';

        $('.configuration').html(configHtml);


    };

    let displayOrderedList = function() {
        let orderedmissionHtml = '';

        orderedMissionList.forEach(function (orderedmission) {
            orderedmissionHtml+='<div id="flex-div"><h2>'+orderedmission.mission_name+'</h2>' +
                // '<div><i class="fas fa-chevron-up fa-1x"></i><i class="fas fa-chevron-down fa-1x"></i></div>' +
                '</div>';
        });

        $('.missions-list').html(orderedmissionHtml);
    };

    //RobotAddMissionConfiguration
    let robotAddMissionConfiguration = function (cb) {

        let robotAddMissionConfiguration_ReqJson = {mission_id: "", mission_conf: "", mission_conf_arr: []};

        robotAddMissionConfiguration_ReqJson.mission_id = selectedMissionId;
        robotAddMissionConfiguration_ReqJson.mission_conf = selectedMissionJson.mission_conf;
        robotAddMissionConfiguration_ReqJson.mission_conf_arr = selectedMissionJson.mission_conf_arr;

        console.log("Saving Conf:");
        console.log(robotAddMissionConfiguration_ReqJson);
        /* $.post("/RobotAddMissionConfiguration", robotAddMissionConfiguration_ReqJson,
             function (data, status) {
                 console.log(data);
                 if (cb) cb();
             });*/

        $.ajax({
            url: "/RobotAddMissionConfiguration"
            , type: 'POST'
            , contentType: 'application/json'
            , data: JSON.stringify(robotAddMissionConfiguration_ReqJson) //stringify is important
            , success: function (data) {
                console.log(data);
                if (cb) cb();
            }
        });

    };

    let saveMissionOrder = function(reqObj,cb){
        $.post("/SaveMissionOrder", { obj:reqObj },
            function (data, status) {
                console.log(data);
                if (cb) cb(data);
            });
    };

    /* CLICK EVENTS ---->  */

    /* missionlistitem */
    $(document).on('click', '.missionlistitem', function () {
        selectedMissionId = $(this).attr('mission_id');
        for (let i = 0; i < storedMissionsList.length; i++) {
            if (storedMissionsList[i]['mission_id'] == selectedMissionId) {
                selectedMissionJson = storedMissionsList[i];
                displayMissionConfiguration();
                return;
            }
        }
    });

    $(document).on('click', '.ordercheckbox', function () {
        // alert($(this).is(':checked'));
        // alert($(this).attr('mission_conf'));

        let mission_id = $(this).attr('mission_id');

        if ($(this).is(':checked')) {
            storedMissionsList.forEach(function (mission) {
                if (mission.mission_id == mission_id) {
                    orderedMissionList.push(mission);
                }
            });
        } else {
            let temp = [];
            orderedMissionList.forEach(function (orderedmission) {
                if (!orderedmission.mission_id == mission_id) {
                    temp.push(orderedmission);
                }
            });
            orderedMissionList = temp;
        }

        console.log(orderedMissionList);
    });

    let clearAll = function () {
        selectedMissionJson.mission_conf_arr = [];
        selectedMissionJson.mission_conf = {};
        displayMissionConfiguration();
    };

    /*submit-button*/
    $('.submit-button').click(function () {
        let missionname = $('#missionname').val();
        let missiondescription = $('#missiondescription').val();
        let buildingnm = $('#buildingnm').val();
        let mapnm = $('#mapnm').val();

        if (!(missionname && missiondescription && buildingnm && mapnm)) return;

        $('#missionname').val('');
        $('#missiondescription').val('');
        $('#buildingnm').val('');
        $('#mapnm').val('');

        let reqObj = {
            "mission_name": missionname,
            "description": missiondescription,
            "building_name": buildingnm,
            "map_name": mapnm
        };

        robotCreateMission(reqObj, function () {
            getAllStoredMissions();
        });
    });

    $('#conf-w').click(function () {
        $("#dialog-waypoint").dialog("open");
    });

    $('#conf-a').click(function () {
        $("#dialog-action").dialog("open");
    });
    $('#conf-t').click(function () {
        $("#dialog-transition").dialog("open");
    });
    $('#conf-l').click(function () {
        $("#dialog-loop").dialog("open");
    });

    $('.orderplus').click(function () {
        $('.orderedmission-list').html('<img class="imuloading" src="images/load.gif">');
        getAllStoredMissions();
        $("#dialog-mission-order").dialog("open");
    });

    $('.orderremove').click(function () {
        orderedMissionList = [];
        displayOrderedList();
    });
    $('#conf-c').click(function () {
        $("#dialog-command").dialog("open");
        $('#command-name').val(JSON.stringify(selectedMissionJson.mission_conf));
    });

    $('#conf-s').click(function () {
        $('.confloading').show();
        robotAddMissionConfiguration(function () {
            $('.confloading').hide();
            getAllStoredMissions();
            clearAll()
        });
    });

    $('#conf-clear').click(function () {
        clearAll()
    });

    //"Go_To  WAVEPOINT A - if_reach ACTION A; Go_To  WAVEPOINT B - if_reach ACTION B; Go_To  WAVEPOINT C - LOOP A"
    $("#submit-waypoint").click(function () {
        let waypoint = $('#waypoint-name').val();
        let waypointX = $('#waypoint-x').val()*1;
        let waypointY = $('#waypoint-y').val()*1;
        let waypointYaw = $('#waypoint-yaw').val()*1;

        console.log(waypoint);
        if(!selectedMissionJson.mission_conf_arr) selectedMissionJson.mission_conf_arr = [];
        selectedMissionJson.mission_conf_arr.push({"NAME": "Waypoint: " + waypoint, "TYP": "W"});

        // selectedMissionJson.mission_conf += 'Go_To  waypoint$' + waypoint;
        if(!selectedMissionJson.mission_conf["waypoints"]) selectedMissionJson.mission_conf["waypoints"] = [];

        selectedMissionJson.mission_conf["waypoints"].push({x:waypointX,y:waypointY,yaw:waypointYaw,nm:waypoint});

        displayMissionConfiguration();
        $("#dialog-waypoint").dialog("close");
    });

    $("#submit-action").click(function () {
        let action = $('#action-name').val();
        console.log(action);
        selectedMissionJson.mission_conf_arr.push({"NAME": "Action: " + action, "TYP": "A"});

        // selectedMissionJson.mission_conf += ' - if_reach ' + action + ';';
        if(!selectedMissionJson.mission_conf["actions"]) selectedMissionJson.mission_conf["actions"] = [];

        selectedMissionJson.mission_conf["actions"].push(action);

        displayMissionConfiguration();
        $("#dialog-action").dialog("close");
    });
    $("#submit-transition").click(function () {
        let transition = $('#transition-name').val();
        console.log(transition);
        selectedMissionJson.mission_conf_arr.push({"NAME": "Transition To: " + transition, "TYP": "T"});

        /*if (selectedMissionJson.mission_conf.endsWith(';')) {
            selectedMissionJson.mission_conf += 'Transition_To  ' + transition + ';';
        } else {
            selectedMissionJson.mission_conf += ';Transition_To  ' + transition + ';';
        }
*/

        if(!selectedMissionJson.mission_conf["transitions"]) selectedMissionJson.mission_conf["transitions"] = [];
        selectedMissionJson.mission_conf["transitions"].push(transition);


        displayMissionConfiguration();
        $("#dialog-transition").dialog("close");
    });
    $("#submit-loop").click(function () {
        let loop = $('#loop-name').val();
        console.log(loop);
        selectedMissionJson.mission_conf_arr.push({"NAME": "Loop : N = " + loop, "TYP": "L"});

        selectedMissionJson.mission_conf["loop"] = loop;

        displayMissionConfiguration();
        $("#dialog-loop").dialog("close");
    });

    $("#submit-command").click(function () {
        let command = $('#command-name').val();
        selectedMissionJson.mission_conf = command;
        console.log(command);
        $("#dialog-command").dialog("close");
    });

    $("#submit-command").click(function () {
        let command = $('#command-name').val();
        selectedMissionJson.mission_conf = command;
        console.log(command);
        $("#dialog-command").dialog("close");
    });

    $("#submit-mission-order").click(function () {
        $("#dialog-mission-order").dialog("close");
        displayOrderedList();
    });

    $('.orderpause').click(function () {
        alert("pa");
    });

    $('.orderplay').click(function () {
        console.log(orderedMissionList);

        let reqObj = {
            MissionOrder:[]
        };

        orderedMissionList.forEach(function (mission) {
            reqObj.MissionOrder.push(mission.mission_id);
        });

        saveMissionOrder(JSON.stringify(reqObj), function (data) {
            if (data.SUC){
                alert("Saved Order");
            } else {
                alert("Error: "+data.MSG);
            }
        });
    });



});

