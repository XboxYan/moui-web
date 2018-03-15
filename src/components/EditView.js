import React, { PureComponent } from 'react';
import util from '../util';
import './base.css';

const ResizeW = (props) => {

    const resizeStart = (ev, type) => {
        ev.stopPropagation();
        const target = ev.target.parentNode.parentNode;
        const { x, y, w, h } = props.res;
        const offsetParentBound = target.offsetParent.getBoundingClientRect();
        const { clientX, clientY } = ev;
        const _X = clientX - x;
        const _Y = clientY - y;
        document.onmousemove = (event) => resize(event, { left: x, top: y, width: w, height: h, _X, _Y, _w: offsetParentBound.width, _h: offsetParentBound.height }, type);
        document.onmouseup = resizeEnd;
    }
    const resize = (event, { left, top, width, height, _X, _Y, _w, _h }, type) => {
        event.stopPropagation();
        const { clientX, clientY } = event;
        let x = left;
        let y = top;
        let w = width;
        let h = height;
        switch (type) {
            case 1:
                y = clientY - _Y;
                h = height + top - y;
                break;
            case 2:
                w = width - left + clientX - _X;
                break;
            case 3:
                h = height - top + clientY - _Y;
                break;
            case 4:
                x = clientX - _X;
                w = width + left - x;
                break;
            case 5:
                x = clientX - _X;
                w = width + left - x;
                if (event.shiftKey) {
                    h = w / width * height;
                    y = height + top - h;
                } else {
                    y = clientY - _Y;
                    h = height + top - y;
                }
                break;
            case 6:
                w = width - left + clientX - _X;
                if (event.shiftKey) {
                    h = w / width * height;
                    y = height + top - h;
                } else {
                    y = clientY - _Y;
                    h = height + top - y;
                }
                break;
            case 7:
                x = clientX - _X;
                w = width + left - x;
                if (event.shiftKey) {
                    h = w / width * height;
                } else {
                    y = clientY - _Y;
                }
                break;
            case 8:
                w = width - left + clientX - _X;
                if (event.shiftKey) {
                    h = w / width * height;
                } else {
                    h = height - top + clientY - _Y;
                }
                break;
            default:
                break;
        }
        w = w < 0 ? 0 : w;
        h = h < 0 ? 0 : h;
        //x吸附left
        if (Math.abs(x) < 10) {
            w += x;
            x = 0;
        }
        //y吸附top
        if (Math.abs(y) < 10) {
            h += y;
            y = 0;
        }
        //x吸附right
        if (Math.abs(x + w - _w) < 10) {
            w = _w - x;
        }
        //x吸附bottom
        if (Math.abs(y + h - _h) < 10) {
            h = _h - y;
        }
        props.resize({ x, y, w, h });
    }

    const resizeEnd = (ev) => {
        ev.stopPropagation();
        document.onmousemove = null;
        document.onmouseup = null;
        props.resizeEnd && props.resizeEnd();
    }

    return (
        <span className="a-resize">
            <i className="a-l a-top" onMouseDown={(ev) => resizeStart(ev, 1)}></i>
            <i className="a-l a-right" onMouseDown={(ev) => resizeStart(ev, 2)}></i>
            <i className="a-l a-bottom" onMouseDown={(ev) => resizeStart(ev, 3)}></i>
            <i className="a-l a-left" onMouseDown={(ev) => resizeStart(ev, 4)}></i>
            <i data-tips="按住Shift等比缩放" className="a-d a-topLeft" onMouseDown={(ev) => resizeStart(ev, 5)}></i>
            <i data-tips="按住Shift等比缩放" className="a-d a-topRight" onMouseDown={(ev) => resizeStart(ev, 6)}></i>
            <i data-tips="按住Shift等比缩放" className="a-d a-bottomLeft" onMouseDown={(ev) => resizeStart(ev, 7)}></i>
            <i data-tips="按住Shift等比缩放" className="a-d a-bottomRight" onMouseDown={(ev) => resizeStart(ev, 8)}></i>
        </span>
    )
}

class EditView extends PureComponent {

    static defaultProps = {
        editable: true,
        allowdrop: true,
        className: "",
    }

    constructor(props) {
        super(props);
        this.state = {
            editable: props.editable,
            w: props.style.w,
            h: props.style.h,
            x: props.style.x || 0,
            y: props.style.y || 0,
            _x: props.style.x || 0,
            _y: props.style.y || 0,
            isDrag: false,
            isHover: false,
            isNodrop: false,
            isOver: false
        };
    }


    //初始位置
    start = {
        x: 0,
        y: 0,
    }

    //放置元素
    overObj = null;

    mouseout = (ev) => {
        ev.stopPropagation();
        this.setState({ isHover: false });
    }

    onMenu = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const { clientX, clientY, } = ev;
        const obj = document.elementsFromPoint(clientX, clientY);
        console.log(obj)
    }

    findDragTarget = (targets) => {
        let len = targets.length;
        let index = -1;
        for (let i = 0; i < len; i++) {
            if (targets[i].dataset.editable === "true") {
                index = i;
                break;
            }
        }
        return index;
    }

    dragStart = (ev) => {
        if (ev.target.className === "editview") {
            return false;
        }
        const { clientX, clientY } = ev;
        let targets = document.elementsFromPoint(clientX, clientY);
        let index = this.findDragTarget(targets);
        if (index < 0) {
            return false;
        }
        let target = targets[index];
        const { left, top, width, height } = target.getBoundingClientRect();
        if (this.state.editable) {
            this.setState({ w: width, h: height })
            ev.stopPropagation();
        } else {
            return false;
        }
        window.$POSITON = { clientX, clientY };
        const offsetParent = target.offsetParent;
        const offsetParentBound = offsetParent.getBoundingClientRect();
        let _left = offsetParentBound.left + offsetParent.scrollLeft;
        let _top = offsetParentBound.top + offsetParent.scrollTop;
        let x = left - _left;
        let y = top - _top;
        this.start = { x, y };
        const _X = clientX - left
        const _Y = clientY - top;
        document.onmousemove = (event) => this.drag(event, { _X, _Y, _left, _top });
        document.onmouseup = this.dragEnd;
        return false;
    }

    drag = (event, { _X, _Y, _left, _top }) => {
        event.stopPropagation();
        const { clientX, clientY } = event;
        if (window.$POSITON.clientX === clientX && window.$POSITON.clientY === clientY) {
            return false;
        }
        this.setState({ isDrag: true });
        //util.addClass(target, 'drag');
        let obj = document.elementsFromPoint(clientX, clientY);
        let overObj = obj[this.findDragTarget(obj) + 1];
        if (overObj) {
            util.addClass(overObj, 'over');
            if (this.overObj && this.overObj !== overObj) {
                util.removeClass(this.overObj, 'over');
            }
            this.overObj = overObj;
        } else {
            return false;
        }
        const { w, h } = this.state;
        const { left, top, width, height } = overObj.getBoundingClientRect();
        const centX = width * .5 - w * .5;
        const centY = height * .5 - h * .5;
        //真实坐标
        let _x = clientX - left - _X;
        let _y = clientY - top - _Y;
        if (overObj.dataset.allowdrop === 'true') {
            this.setState({ isNodrop: false });
            //util.removeClass(target,'nodrop');
            //x吸附left
            if (Math.abs(_x) < 10) {
                _x = 0;
            }
            //y吸附top
            if (Math.abs(_y) < 10) {
                _y = 0;
            }
            //x吸附right
            if (Math.abs(_x + w - width) < 10) {
                _x = width - w;
            }
            //x吸附bottom
            if (Math.abs(_y + h - height) < 10) {
                _y = height - h;
            }
            //居中吸附X
            if (Math.abs(_x - centX) < 10) {
                _x = centX;
            }
            //居中吸附Y
            if (Math.abs(_y - centY) < 10) {
                _y = centY;
            }
        } else {
            this.setState({ isNodrop: true });
            //util.addClass(target,'nodrop');
        }
        this.setState({
            _x: left - _left + _x,
            _y: top - _top + _y,
            x: _x,
            y: _y
        });
    }

    dragEnd = (ev) => {

        ev.stopPropagation();
        const { clientX, clientY } = ev;
        document.onmousemove = null;
        document.onmouseup = null;
        if (window.$POSITON.clientX === clientX && window.$POSITON.clientY === clientY) {
            return false;
        } else {
            this.setState({ isDrag: false });
        }
        if (this.overObj && this.overObj.dataset.allowdrop === 'true') {
            util.removeClass(this.overObj, 'over');
            //console.log(this.overObj)
            const { x, y } = this.state;
            this.props.dragEnd && this.props.dragEnd({ x, y },this.overObj.dataset.index);
        } else {
            const { x, y } = this.start;
            this.setState({
                _x: x,
                _y: y,
                x,
                y,
                isNodrop: false
            });
            util.removeClass(this.overObj, 'over');
        }
    }

    resize = ({ x, y, w, h }) => {
        this.setState({
            _x: x,
            _y: y,
            x,
            y,
            w,
            h
        });
    }

    resizeEnd = () => {
        this.props.resizeEnd && this.props.resizeEnd(this);
    }

    dragover = (ev) => {
        //ev.stopPropagation();
        //console.log(this)
    }

    ondragover = (ev) => {
        ev.stopPropagation();
        const { allowdrop } = this.props;
        if (allowdrop) {
            this.setState({ isOver: true });
            ev.preventDefault();
        }
    }

    ondragleave = () => {
        this.setState({ isOver: false });
    }

    ondrop = (ev) => {
        ev.stopPropagation();
        const { allowdrop } = this.props;
        if (allowdrop) {
            const source = ev.dataTransfer.getData('source');
            const { clientX, clientY } = ev;
            if (source === 'left') {
                let x = clientX - ev.dataTransfer.getData('x') - this.state.x;
                let y = clientY - ev.dataTransfer.getData('y') - this.state.y;
                const type = ev.dataTransfer.getData('type');
                const {index} = this.props;
                this.props.addCom&&this.props.addCom({type,x,y,index})
            }
            this.setState({ isOver: false });
            ev.preventDefault();
        }

    }

    togglelock = (ev) => {
        ev.stopPropagation();
        let { editable } = this.state;
        this.setState({ editable: !editable });
        this.props.togglelock && this.props.togglelock(this);
    }

    //键盘移动
    keymove = (ev) => {
        ev.stopPropagation();
        const { editable } = this.state;
        if (!editable) {
            return false;
        }
        const move = () => {
            ev.preventDefault(ev);
            this.setState({ x, y, _x: x, _y: y })
        }
        let { x, y } = this.state;
        let step = 1;
        if (ev.shiftKey) {
            step = 10;
        }
        switch (ev.keyCode) {
            case 37:
                x -= step;
                move();
                break;
            case 38:
                y -= step;
                move();
                break;
            case 39:
                x += step;
                move();
                break;
            case 40:
                y += step;
                move();
                break;
            default:
                break;
        }
    }

    keymoveEnd = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        if (ev.keyCode === 37 || ev.keyCode === 38 || ev.keyCode === 39 || ev.keyCode === 40) {
            this.props.dragEnd && this.props.dragEnd(this);
        }
    }

    hover = (ev) => {
        ev.stopPropagation();
        this.setState({ isHover: true });
    }

    onClick = (ev) => {
        //console.log(this)
        ev.stopPropagation();
        this.props.onClick && this.props.onClick(this);
    }

    onFocus = (ev) => {
        ev.stopPropagation();
        this.props.onFocus && this.props.onFocus(this);
    }

    onDoubleClick = (ev) => {
        ev.stopPropagation();
        this.props.onDoubleClick && this.props.onDoubleClick(ev);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.editable !== this.props.editable) {
            console.log(555)
            this.setState({ editable: nextProps.editable });
        }
        // if(nextProps.style.x!==this.state.x){
        //     this.setState({x:nextProps.style.x,_x:nextProps.style.x});
        // }
        // if(nextProps.style.y!==this.state.y){
        //     this.setState({y:nextProps.style.y,_y:nextProps.style.y});
        // }
        // if(nextProps.style.w!==this.state.w){
        //     this.setState({w:nextProps.style.w});
        // }
        // if(nextProps.style.h!==this.state.h){
        //     this.setState({h:nextProps.style.h});
        // }
    }

    componentDidMount() {
        //document.addEventListener('mousedown', this.dragStart, false);
        //document.addEventListener('mouseover', this.hover, false);
    }

    renderChild = () => {
        return this.props.children;
    }

    render() {
        const { className, allowdrop, index } = this.props;
        const { editable, w, h, x, y, _x, _y, isDrag, isHover, isNodrop, isOver } = this.state;
        //const {x,y,w,h} = this.props;
        const sizeW = parseInt(w, 10) >= 0 ? { width: w } : {};
        const sizeH = parseInt(h, 10) >= 0 ? { height: h } : {};
        return (
            <div
                onClick={this.onClick}
                onDoubleClick={this.onDoubleClick}
                onContextMenu={this.onMenu}
                style={{ transform: `translate(${_x}px,${_y}px)`, ...sizeW, ...sizeH }}
                tabIndex={0}
                data-index={index}
                onMouseOver={this.hover}
                onKeyDown={this.keymove}
                onKeyUp={this.keymoveEnd}
                onFocus={this.onFocus}
                data-pos-x={x}
                data-pos-y={y}
                data-res-w={w}
                data-res-h={h}
                data-editable={editable}
                data-allowdrop={allowdrop}
                data-isdrag={isDrag}
                data-ishover={isHover}
                data-isover={isOver}
                data-isnodrop={isNodrop}
                onDragOver={this.ondragover}
                onDragLeave={this.ondragleave}
                onDrop={this.ondrop}
                onMouseOut={this.mouseout}
                onMouseDown={this.dragStart}
                className={`view ${className}`}>
                <span onClick={this.togglelock} className="editview" />
                {editable && <ResizeW res={{ x, y, w, h }} resize={this.resize} resizeEnd={this.resizeEnd} />}
                {this.renderChild()}
            </div>
        );
    }
}

export default EditView;