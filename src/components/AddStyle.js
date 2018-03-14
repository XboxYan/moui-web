import React, { PureComponent, Fragment } from 'react';
import './base.css';
function getDisplayName(component) {
    return component.displayName || component.name || 'Component';
}
export default function AddStyle(WrappedComponent) {
    return class extends PureComponent {
        static displayName = `AddStyle-${getDisplayName(WrappedComponent)}`
        constructor(props) {
            super(props);

        }
        state = {
            isdrag: false,
            x: 0,
            y: 0,
            _x: 0,
            _y: 0
        }

        paseStyle = (style) => {
            let STYLE = {}
            for ( let name in style){
                switch (name) {
                    case 'w':
                        STYLE['width'] = style[name];
                        break;
                    case 'h':
                        STYLE['height'] = style[name];
                        break;
                    default:
                        STYLE[name] = style[name];
                        break;
                }
                
            }
            return STYLE;
        }

        render() {
            const { style } = this.props;
            const newProps = {
                style: this.paseStyle(style)
            }
            //const style = Object.assign({}, this.props.style, { transform: `translate(${x}px,${y}px)` });
            //console.log(style)
            return (
                <WrappedComponent {...this.props} {...newProps} />
            )
        }
    }
}