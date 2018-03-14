import React, { PureComponent, Fragment } from 'react';
import './base.css';
function getDisplayName(component) {
    return component.displayName || component.name || 'Component';
}

export default function (option={allowDrap:true}) {
    return function Draggble(WrappedComponent) {
        return class extends PureComponent {
            static displayName = `Draggble-${getDisplayName(WrappedComponent)}`
            constructor(props) {
                super(props);
                this.state = {
                    isdrag: false,
                    x: props.style.x,
                    y: props.style.y,
                    _x: props.style.x,
                    _y: props.style.y,
                    editable:true
                };
            }
            state = {
                isdrag: false,
                x: 0,
                y: 0,
                _x: 0,
                _y: 0,
                editable:true
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
                    y: clientY - top + _top,
                }
            }

            onDrag = (ev) => {
                ev.stopPropagation();
                ev.preventDefault();
                const { clientX, clientY } = ev;
                this.setState({
                    _x: clientX - this.start.x,
                    _y: clientY - this.start.y,
                });
            }

            onDragOver = (ev) => {
                if(option.allowDrap){
                    ev.stopPropagation();
                    ev.preventDefault();
                }
            }

            onDrop = (ev) => {
                if(option.allowDrap){
                    ev.stopPropagation();
                    ev.preventDefault();
                    const source = ev.dataTransfer.getData('source');
                    const { clientX, clientY } = ev;
                    
                    if(source==='left'){
                        let x = clientX -ev.dataTransfer.getData('x')-this.state.x;
                        let y = clientY -ev.dataTransfer.getData('y')-this.state.y;
                        this.props.onDrop && this.props.onDrop(this,x,y);
                    }
                }
            }

            move = () => {
                console.log(6666)
            }

            onDragEnd = (ev) => {
                ev.stopPropagation();
                const { clientX, clientY } = ev;
                let x = clientX - this.start.x;
                let y = clientY - this.start.y;
                this.setState({
                    isdrag: false,
                    x,
                    y,
                    _x: x,
                    _y: y,
                });
                this.props.onDragEnd && this.props.onDragEnd(this, x, y);
            }

            render() {
                const { isdrag, x, y, _x, _y, editable } = this.state;
                //const style = Object.assign({}, this.props.style, { transform: `translate(${x}px,${y}px)` });
                //console.log(this.props)
                return (
                    <Fragment>
                        <div
                            className='view'
                            style={{ transform: `translate(${x}px,${y}px)` }}
                            draggable={editable}
                            onClick={this.onClick}
                            onDragStart={this.onDragStart}
                            onDragOver={this.onDragOver}
                            onDrag={this.onDrag}
                            onDrop={this.onDrop}
                            onDragEnd={this.onDragEnd}
                            data-isdrag={isdrag}
                        >
                            <WrappedComponent {...this.props} onDragEnd={this.onDragEnd} />
                        </div>
                        {
                            isdrag &&
                            <div
                                className='view viewprew'
                                data-pos-x={_x}
                                data-pos-y={_y}
                                style={{ transform: `translate(${_x}px,${_y}px)` }}
                                data-isdrag={isdrag}
                            >
                                <WrappedComponent {...this.props} />
                            </div>
                        }

                    </Fragment>
                )
            }
        }
    }
}