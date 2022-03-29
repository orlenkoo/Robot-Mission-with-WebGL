import React from 'react';
import './styles.css';
import {Image, Row, Col} from 'antd';
import PropTypes from 'prop-types';

class TitleBubble extends React.Component {

    propTypes = {
        title: PropTypes.string,
        circleColor: PropTypes.string,
        iClass: PropTypes.string,
        svgUrl: PropTypes.string
    };

    render() {
        let {
            title,
            circleColor,
            svgUrl,
            style,
            iClass
        } = this.props;

        if (!style) {
            style = { margin: "0.6rem 1rem 1rem 0.6rem" };
        }

        return <div style={style} className="bubble-heading-container">
            <div className="bubble-logo-container" style={{"background-color": circleColor}}>
                { (svgUrl)? <img className="bubble-imgSvg" src={svgUrl} alt=""/>: <div></div>}
                { (iClass)? <i className={"bubble-imgSvg" + " " + iClass}></i>: <div></div>  }
            </div>
            <h2 className="bubble-title" style={{fontSize: "1rem"}}>{title}</h2>
        </div>;
    }
}

export default TitleBubble;
