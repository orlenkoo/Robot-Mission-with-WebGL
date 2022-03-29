import React from 'react';
import './styles.css';

class FloatingBox extends React.Component {


    render() {
        const {
            light
        } = this.props;

        if (light) {
            return <div style={this.props.style} className="wrapper-div floating-card-divs-light ">
                {
                    this.props.children
                }
            </div>;
        } else {
            return <div style={this.props.style} className="wrapper-div floating-card-divs">
                {
                    this.props.children
                }
            </div>;
        }

    }
}

export default FloatingBox;
