import React, { PureComponent, Fragment } from 'react';
import './base.css';
function getDisplayName(component) {
    return component.displayName || component.name || 'Component';
}
export default function Draggble(WrappedComponent) {
    return class extends PureComponent {
        static displayName = `Draggble-${getDisplayName(WrappedComponent)}`

        state = {
            isdrag: false,
            x: 0,
            y: 0,
            _x: 0,
            _y: 0
        }

        onClick = () => {
            alert(3)
        }

        componentDidMount() {
            //console.log(this.props.style)
        }

        onDragStart = (ev) => {
            this.setState({ isdrag: true });
            ev.stopPropagation();
            const { clientX, clientY } = ev;
            const { left, top, width, height } = ev.target.getBoundingClientRect();
            const offsetParent = ev.target.offsetParent;
            const offsetParentBound = offsetParent.getBoundingClientRect();
            let _left = offsetParentBound.left + offsetParent.scrollLeft;
            let _top = offsetParentBound.top + offsetParent.scrollTop;
            this.start = {
                x: clientX - left + _left,
                y: clientY - top + _top
            }
        }

        onDrag = (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            const { clientX, clientY } = ev;
            this.setState({
                _x: clientX - this.start.x,
                _y: clientY - this.start.y
            });
        }

        onDragEnd = (ev) => {
            ev.stopPropagation();
            const { clientX, clientY } = ev;
            this.setState({
                isdrag: false,
                x: clientX - this.start.x,
                y: clientY - this.start.y
            });
        }

        render() {
            const { isdrag, x, y, _x, _y } = this.state;
            const style = Object.assign({}, this.props.style, { transform: `translate(${x}px,${y}px)` });
            //console.log(style)
            return (
                <Fragment>
                    <WrappedComponent
                        {...this.props}
                        style={style}
                        draggable={true}
                        onClick={this.onClick}
                        onDragStart={this.onDragStart}
                        onDrag={this.onDrag}
                        onDragEnd={this.onDragEnd}
                        data-isdrag={isdrag}
                    />
                    {
                        isdrag &&
                        <div
                            className='view'
                            data-isdrag={isdrag}
                            data-pos-x={_x}
                            data-pos-y={_y}
                            style={{ whiteSpace:'noWrap', opacity: 1, position: 'fixed', pointerEvents: 'none', transform: `translate(${_x}px,${_y}px)` }}
                        >
                            <WrappedComponent {...this.props} />
                        </div>
                    }

                </Fragment>
            )
        }
    }
}