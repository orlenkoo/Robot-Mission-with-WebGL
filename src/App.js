import logo from './logo.svg';
import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import 'antd/dist/antd.css';

import MissionPage from "./pages/missions/MissionPage";
import ResponsiveViewer from "./components/ResponsiveViewer";
import RosConnect from "./components/ros/RosConnect/RosConnect";


class App extends React.Component {

    state = {
        rosInstance: null,
    };

    rosConnectCallback = (status, message, ros) => {
        if (status) {
            this.setState({
                rosInstance: ros
            });
        } else {
            alert("Status: "+status+" | Error Message: "+message);
        }
    };

    componentDidMount() {

    }

    render() {
        const {
            rosInstance
        } = this.state;

        const render = ()=> {
            if(!rosInstance) {
                return <div style={{color: "white"}}><RosConnect defaultText={"Connecting..."} /*url={"ws://13.233.6.110:9090"} */callback={this.rosConnectCallback}/></div>
            }

            /* RESETTING KEY ON RENDER TO RERENDER PAGE ON SCREEN SIZE CHANGE */
            return <Router>
                <Switch>
                    <Route path="/" key={new Date().getTime()+3} component={()=>{ return <MissionPage rosInstance={rosInstance} /> }} />
                </Switch>
            </Router>
        };

        return <ResponsiveViewer render={render} />
    }
}

export default App;
