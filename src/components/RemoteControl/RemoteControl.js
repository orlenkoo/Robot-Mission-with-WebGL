import React from 'react';
import './styles.css';
import RosJoyStick from "../ros/RowJoyStick/RosJoyStick";

class RemoteControl extends React.Component {

    whitefontStyle= {color:"white"}

    render() {
        const {
            joystickCallback
        } = this.props;

        return <div className="column3">

            <div className="status">
                <div className="system-status">
                    <h3 style={this.whitefontStyle}>System Status</h3>
                    <h1 id="system-status-val" style={this.whitefontStyle}>Connected</h1>
                </div>
                <div className="speed-distance " >
                    <div className="speed">
                        <h3 style={this.whitefontStyle}>Speed</h3>
                        <h1 style={this.whitefontStyle}>-</h1>
                    </div>
                    <div className="distance ">
                        <h3 style={this.whitefontStyle}>Distance</h3>
                        <h1 style={this.whitefontStyle}>-</h1>
                    </div>
                </div>
                <div className="system-slider ">
                    <h3 style={this.whitefontStyle}>0%</h3>
                    <div className="progress-div ">
                        <progress max="100" value="0" id="PROGRESS_PERCENT_COMPLETED" />
                    </div>
                </div>
            </div>


            <div className="mission">
                <div className="current-mission mission-styles">
                    <h2 className="mission-heading">Current Mission</h2>
                    <h3 className="mission-description">-</h3>
                </div>

                <div className="status-mission mission-styles">
                    <h2 className="mission-heading">Status</h2>
                    <h3 className="mission-description">-</h3>
                </div>

                <div className="current mission-styles">
                    <h2 className="mission-heading">Current</h2>
                    <h3 className="mission-description">-</h3>
                </div>

                <div className="next mission-styles">
                    <h2 className="mission-heading">Next</h2>
                    <h3 className="mission-description">-</h3>
                </div>

                <div className="current-task mission-styles">
                    <h2 className="mission-heading">Current Task</h2>
                    <h3 className="mission-description">-</h3>
                </div>

                <div className="next-task mission-styles">
                    <h2 className="mission-heading">Next Task</h2>
                    <h3 className="mission-description" id="last-item">-</h3>
                </div>
            </div>


            <div className="joystick-actual">
                <div className="play-pause">
                    <i className="start-btn fas fa-play fa-2x"></i>
                    <i className="stop-btn fas fa-square fa-2x"></i>
                </div>

                <div className="joystick-control">
                    <div className="noselect">
                        <div className="container">
                            <div className="center-align">
                                <RosJoyStick onMove={joystickCallback}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>;
    }
}

export default RemoteControl;
