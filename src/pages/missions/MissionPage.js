import React from 'react';
import './styles.css';
import {Col, Row, Menu, Dropdown, Modal, Form, Input, InputNumber, Switch, Button} from "antd";
import NavBar from "../../components/navbar/NavBar";
import {buttonConfig, logoURL, BASE_URL} from "../../config";
import FloatingBox from "../../components/FloatingBox/FloatingBox";
import TitleBubble from "../../components/TitleBubble/TitleBubble";
import GridMap3D from "../../components/ros/gridmap3d/GridMap3D";
import {JsonFileUploader} from "../../components/JsonFileUploader/JsonFileUploader";

const SCREEN_PERCENTAGE = 1;

const {
    ROS2D,
    ROSLIB,
    ROS3D,
    NAV2D
} = window;

class MissionPage extends React.Component {
    constructor(props) {
        super(props);
        this.ros = props.rosInstance;
    }

    screenHeight = window.innerHeight;

    state = {
        displayCreateMissionModal: false,
        displaySelectMissionModal: false,
        missionsList: []
    };

    markerRef = React.createRef();
    formRef = React.createRef();

    sendValue = (obj, topicName) => {
        let topic = new ROSLIB.Topic({
            ros: this.ros,
            name: (topicName) ? topicName : '/mission_messages',
            messageType: 'std_msgs/String'
        });

        let message = new ROSLIB.Message(obj);
        topic.publish(message.data)
    };

    getValue = (topicName) => {
        let topice = new ROSLIB.Topic({
            ros: this.ros,
            name: (topicName) ? topicName : '/mission_messages',
            messageType: 'std_msgs/String'
        });

        topice.subscribe((message) => {
            if (!message.data) return;
            this.setState({
                receivedData: message.data
            })
        });
    };

    addMarkers = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            const markerMessage = {};
            markerMessage.header = {};
            markerMessage.header.frame_id = "base_link";
            markerMessage.ns = "my_namespace";
            markerMessage.id = 0;
            markerMessage.type = 1;
            markerMessage.pose = {position: {}, orientation: {}};
            markerMessage.pose.position.x = arr[i].x;
            markerMessage.pose.position.y = arr[i].y;
            markerMessage.pose.position.z = arr[i].z;
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
            markerMessage.color.r = 1.0;
            markerMessage.color.g = 1.0;
            markerMessage.color.b = 0.0;
            console.log("Adding", markerMessage);
            this.markerRef.current.addMarker(markerMessage);
        }
    };


    componentDidMount() {
        this.getMissionsFromDb((missionsList) => {
            console.log("missionsList", missionsList.result);
            this.setState({
                missionsList: missionsList.result
            })
        })
    }

    showCreateMissionModal = (bool) => {
        this.setState({
            displayCreateMissionModal: bool
        })
    };

    showSelectMissionModal = (bool) => {
        this.setState({
            displaySelectMissionModal: bool
        })
    };

    onCreateMissionFinish = (values) => {
        console.log('Success:', values, JSON.stringify(values));
        this.formRef.current.resetFields();
        this.showCreateMissionModal(false);
        this.addMissionToDb(values, (result) => {
            if (result.success) {
                alert("Mission Created");
                this.getMissionsFromDb((missionsList) => {
                    console.log("missionsList", missionsList.result);
                    this.setState({
                        missionsList: missionsList.result
                    })
                })
            }
        });
    };

    onCreateMissionFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        alert("Mission Create Error");

    };

    addMissionToDb = async (obj, cb) => {
        const rawResponse = await fetch(BASE_URL + '/generic/kitau_robot_website/missions/add', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        });
        const content = await rawResponse.json();

        console.log("Add", content);

        if (cb) {
            cb(content);
        }
    };

    getMissionsFromDb = async (cb) => {
        const rawResponse = await fetch(BASE_URL + '/generic/kitau_robot_website/missions/get', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        const content = await rawResponse.json();

        console.log("Get", content);

        if (cb) {
            cb(content);
        }
    };

    selectMission = (mission) => {
        this.selected_mission = mission;
        this.sendValue({
            data: JSON.stringify(mission)
        }, "/selected_mission");
    };

    jsonFileCallback = (json) => {
        this.addMarkers(json)
    };

    runCommand = ()=> {
        const command = prompt("Command");

        fetch(BASE_URL+"/bash", {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bash_command: command
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log("Bash Command: ", data);
                alert(JSON.stringify(data))
            });
    };

    menu = (
        <Menu>
            <Menu.Item>
                <Button onClick={() => {
                    this.showCreateMissionModal(true)
                }}>Create a Mission</Button>
                <Button
                    onClick={() => {
                        this.sendValue({data: "COBWEB_CLEAN"})
                    }}>Cobweb Clean</Button>
                <Button onClick={() => {
                    this.sendValue({data: "FLOOR_CLEAN"})
                }}>Floor Clean</Button>
                <Button onClick={() => {
                    this.sendValue({data: "START_MISSION"})
                }}>Start Mission</Button>
                <Button onClick={() => {
                    this.sendValue({data: "STOP_MISSION"})
                }}>Stop Mission</Button>
                <Button onClick={() => {
                    this.showSelectMissionModal(true);
                }}>Select Mission</Button>
                <Button onClick={() => {
                    this.runCommand();
                }}>Run Command</Button>
                <JsonFileUploader callback={this.jsonFileCallback}/>
            </Menu.Item>
        </Menu>
    );

    render() {

        const {
            displayCreateMissionModal,
            displaySelectMissionModal,
            missionsList
        } = this.state;


        const getCreateMissionModalJsx = () => {
            return <Modal title="Create Mission" visible={displayCreateMissionModal} footer={false} onCancel={() => {
                this.showCreateMissionModal(false)
            }}>
                <Form
                    ref={this.formRef}
                    layout="horizontal"
                    size="small"
                    onFinish={this.onCreateMissionFinish}
                    onFinishFailed={this.onCreateMissionFinishFailed}
                    initialValues={{
                        "num_racks": 0,
                        "length": 0,
                        "breadth": 0,
                        "cobweb_clean": false,
                        "floor_clean": false
                    }}
                >
                    <Form.Item name={"mission_name"} label="Mission Name" rules={[
                        {
                            required: true,
                        },
                    ]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={"num_racks"} label="Number of Racks">
                        <InputNumber/>
                    </Form.Item>
                    <Form.Item name={"length"} label="Length">
                        <InputNumber/>
                    </Form.Item>
                    <Form.Item name={"breadth"} label="Breadth">
                        <InputNumber/>
                    </Form.Item>
                    <Form.Item name={"cobweb_clean"} label="Cobweb Clean">
                        <Switch/>
                    </Form.Item>
                    <Form.Item name={"floor_clean"} label="Floor Clean">
                        <Switch/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        };

        const getSelectMissionModalJsx = () => {
            return <Modal title="Select Mission" visible={displaySelectMissionModal} footer={false} onCancel={() => {
                this.showSelectMissionModal(false)
            }}>
                {
                    missionsList.map((mission) => {
                        return <Row><Col span={18}><h6>{mission.mission_name}</h6></Col><Col span={6}><Button
                            onClick={() => {
                                this.selectMission(mission);
                                this.showSelectMissionModal(false);
                            }}>Select</Button></Col>
                            <br/>
                            <br/>
                        </Row>
                    })
                }
            </Modal>
        };

        return <Row>
            <Col style={{height: this.screenHeight * SCREEN_PERCENTAGE, padding: 30}} span={3}>
                <div className="wrapper-div" style={{height: this.screenHeight * SCREEN_PERCENTAGE - 60}}><NavBar
                    logoUrl={logoURL} buttonConfig={buttonConfig} selectedIndex={3}/></div>
            </Col>
            <Col style={{height: this.screenHeight * 0.90, padding: 30}} span={21}>
                <Row>
                    <Col span={24}>
                        <FloatingBox style={{height: this.screenHeight * 0.90 - 60}}>
                            {this.menu}
                            {/*<Dropdown overlay={this.menu} placement="bottomLeft">
                                <a>
                                    <TitleBubble style={{margin: "0.6rem"}} title={"Open Settings"}
                                                 iClass={"fas fa-cog"} circleColor={"orange"}/>
                                </a>
                            </Dropdown>*/}

                            <GridMap3D ros={this.ros} id="545" gridVisibility={true} ref={this.markerRef}
                                       gridNumCells={100} odomVisibility={true}/>
                        </FloatingBox>
                    </Col>
                </Row>

            </Col>
            {getCreateMissionModalJsx()}
            {getSelectMissionModalJsx()}
        </Row>;
    }
}

export default MissionPage;
