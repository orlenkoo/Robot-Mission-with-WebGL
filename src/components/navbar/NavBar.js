import React from 'react';
import './styles.css';
import {Image, Row, Col} from 'antd';


class NavBar extends React.Component {


    render() {
        const {
            logoUrl,
            buttonConfig,
            selectedIndex,
            horizontal
        } = this.props;

        const selectedButtonStyle = {
            "background-color": "rgb(30, 30, 30)",
            "border-radius": "10px"
        };

        if (horizontal) {
            return <div>
                <Row>
                    <Col span={24}>
                        <div className="logo-div-4">
                            <img className="logo" src={logoUrl} alt="logo"/>
                        </div>
                    </Col>
                    <Col span={24} style={{marginTop: 10}}>

                    <div className="logo-div-3">
                        <Row>
                        {
                            buttonConfig.map((btns, i) => {
                                let navBtnsStyle = {};
                                if (btns.selected || i == selectedIndex) {
                                    navBtnsStyle = selectedButtonStyle;
                                }
                                return <Col span={2}><div className="navBtns2" style={navBtnsStyle}><a href={btns.href}><img
                                    style={{height: btns.size}} className="logo" src={btns.img} alt="logo"/></a></div></Col>
                            })
                        }
                        </Row>
                    </div>
                    </Col>

                </Row>
            </div>
        }

        return <div>
            <div className="logo-div">
                <img className="logo" src={logoUrl} alt="logo"/>
            </div>

            <div className="logo-div-2">
                {
                    buttonConfig.map((btns, i) => {
                        let navBtnsStyle = {};
                        if (btns.selected || i == selectedIndex) {
                            navBtnsStyle = selectedButtonStyle;
                        }
                        return <div className="navBtns" style={navBtnsStyle}><a href={btns.href}><img
                            style={{height: btns.size}} className="logo" src={btns.img} alt="logo"/></a></div>
                    })
                }
            </div>

        </div>;
    }
}

export default NavBar;
