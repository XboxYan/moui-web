import React, { PureComponent } from 'react';
import util from '../util';
import './base.css';

const ResizeW = (props) => {
    let res = {
        target: null,
        w: 0,
        h: 0
    }

    const resizeStart = (ev, type) => {
        ev.stopPropagation();
        const target = ev.target.parentNode.parentNode;
        const offsetParentBound = target.offsetParent.getBoundingClientRect();
        const { clientX, clientY } = ev;
        const { left, top, width, height } = target.getBoundingClientRect();
        const _X = clientX - left + offsetParentBound.left;
        const _Y = clientY - top + offsetParentBound.top;
        const x = left - offsetParentBound.left;//初始坐标
        const y = top - offsetParentBound.top;
        document.onmousemove = (event)=>resize(target, event, { left, top, width, height, _X, _Y, l: x, t: y,_w:offsetParentBound.width,_h:offsetParentBound.height }, type);
        document.onmouseup = resizeEnd;
    }
    const resize = (target, event, { left, top, width, height, _X, _Y, l, t, _w, _h }, type) => {
        event.stopPropagation();
        const { clientX, clientY } = event;
        let x = l;
        let y = t;
        let w = width;
        let h = height;
        switch (type) {
            case 1:
                h = height + top - clientY;
                y = clientY - _Y;
                break;
            case 2:
                w = clientX - left;
                break;
            case 3:
                h = clientY - top;
                break;
            case 4:
                w = width + left - clientX;
                x = clientX - _X;
                break;
            case 5:
                w = width + left - clientX;
                h = height + top - clientY;
                x = clientX - _X;
                y = clientY - _Y;
                break;
            case 6:
                w = clientX - left;
                h = height + top - clientY;
                y = clientY - _Y;
                break;
            case 7:
                w = width + left - clientX;
                h = clientY - top;
                x = clientX - _X;
                break;
            case 8:
                w = clientX - left;
                if(event.shiftKey){
                    h = parseInt(w/width*height,10);
                }else{
                    h = clientY - top;
                }
                break;
            default:
                break;
        }
        w = w < 0 ? 0 : w;
        h = h < 0 ? 0 : h;
        //x吸附left
        if( Math.abs(x)<10){
            w += x;
            x = 0;  
        }
        //y吸附top
        if( Math.abs(y)<10){
            h += y;
            y = 0;
        }
        //x吸附right
        if( Math.abs(x+w-_w)<10){
            w = _w-x;
        }
        //x吸附bottom
        if( Math.abs(y+h-_h)<10){
            h = _h-y;
        }
        target.style.width = w + 'px';
        target.style.height = h + 'px';
        target.style.transform = `translate(${x}px,${y}px)`;
        target.dataset.resW = w;
        target.dataset.resH = h;
        target.dataset.posX = x;
        target.dataset.posY = y;
        res = { target, w, h, x, y };
    }

    const resizeEnd = (ev) => {
        ev.stopPropagation();
        document.onmousemove = null;
        document.onmouseup = null;
        props.resizeEnd && props.resizeEnd(res);
    }

    return (
        <span className="a-resize">
            <i className="a-l a-top" onMouseDown={(ev) => resizeStart(ev, 1)}></i>
            <i className="a-l a-right" onMouseDown={(ev) => resizeStart(ev, 2)}></i>
            <i className="a-l a-bottom" onMouseDown={(ev) => resizeStart(ev, 3)}></i>
            <i className="a-l a-left" onMouseDown={(ev) => resizeStart(ev, 4)}></i>
            <i className="a-d a-topLeft" onMouseDown={(ev) => resizeStart(ev, 5)}></i>
            <i className="a-d a-topRight" onMouseDown={(ev) => resizeStart(ev, 6)}></i>
            <i className="a-d a-bottomLeft" onMouseDown={(ev) => resizeStart(ev, 7)}></i>
            <i data-tips="按住Shift等比缩放" className="a-d a-bottomRight" onMouseDown={(ev) => resizeStart(ev, 8)}></i>
        </span>
    )
}

class View extends PureComponent {

    static defaultProps = {
        editable: true,
        allowdrop : true,
        className: "",
        x: 0,
        y: 0,
    }

    constructor(props) {
        super(props);
        this.state = {
            editable: props.editable
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
        if (window.$_HOVER) {
            util.removeClass(window.$_HOVER, "hover");
        }
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

    dargStart = (ev) => {
        ev.stopPropagation();
        const { clientX, clientY } = ev;
        window.$POSITON = { clientX, clientY };
        let targets = document.elementsFromPoint(clientX, clientY);
        let index = this.findDragTarget(targets);
        if (index < 0) {
            return false;
        }
        let target = targets[index];
        if (this.state.editable) {
            const { width, height } = target.getBoundingClientRect();
            target.dataset.resW = parseInt(width,10);
            target.dataset.resH = parseInt(height,10);
        }
        const { left, top } = target.getBoundingClientRect();
        const offsetParent = target.offsetParent;
        const offsetParentBound = offsetParent.getBoundingClientRect();
        let _left = offsetParentBound.left + offsetParent.scrollLeft;
        let _top = offsetParentBound.top + offsetParent.scrollTop;
        target.dataset.posX = left - _left;
        target.dataset.posY = top - _top;
        this.start = {
            x: left - _left,
            y: top - _top,
        }
        const _X = clientX - left
        const _Y = clientY - top;
        document.onmousemove = (event) => this.darg(target, event, { _X, _Y, _left, _top });
        document.onmouseup = this.dargEnd;
        return false;
    }

    darg = (target, event, { _X, _Y, _left, _top }) => {
        event.stopPropagation();
        const { clientX, clientY } = event;
        if (window.$POSITON.clientX === clientX && window.$POSITON.clientY === clientY) {
            return false;
        }
        util.addClass(target, 'drag');
        let obj = document.elementsFromPoint(clientX, clientY);
        let overObj = obj[this.findDragTarget(obj) + 1];
        
        const { offsetWidth, offsetHeight } = target;
        
        if (overObj) {
            util.addClass(overObj, 'over');
            if (this.overObj && this.overObj !== overObj) {
                util.removeClass(this.overObj, 'over');
            }
            this.overObj = overObj;
        }else{
            return false;
        }
        const { left, top, width, height } = overObj.getBoundingClientRect();
        const centX = parseInt(width*.5 - offsetWidth*.5,10);
        const centY = parseInt(height*.5 - offsetHeight*.5,10);
        //真实坐标
        let _x = clientX - left - _X;
        let _y = clientY - top - _Y;
        if(overObj.dataset.allowdrop==='true'){
            util.removeClass(target,'nodrop');
            //x吸附left
            if( Math.abs(_x)<10){
                _x = 0;
            }
            //y吸附top
            if( Math.abs(_y)<10){
                _y = 0;
            }
            //x吸附right
            if( Math.abs(_x+offsetWidth-width)<10){
                _x = width-offsetWidth;
            }
            //x吸附bottom
            if( Math.abs(_y+offsetHeight-height)<10){
                _y = height-offsetHeight;
            }
            //居中吸附X
            if( Math.abs(_x-centX)<10){
                _x = centX;
            }
            //居中吸附Y
            if( Math.abs(_y-centY)<10){
                _y = centY;
            }
        }else{
            util.addClass(target,'nodrop');
        }
        target.style.transform = `translate(${left-_left+_x}px,${top-_top+_y}px)`;
        target.dataset.posX = _x;
        target.dataset.posY = _y;
        window.$VIEW_STATE = { x: _x, y: _y, target, overTarget: this.overObj };
    }

    dargEnd = (event) => {
        event.stopPropagation();
        const { clientX, clientY } = event;
        document.onmousemove = null;
        document.onmouseup = null;
        if (window.$POSITON.clientX === clientX && window.$POSITON.clientY === clientY) {
            return false;
        } else {
            util.removeClass(window.$VIEW_STATE.target, 'drag');
        }
        const {target,overTarget} = window.$VIEW_STATE;
        if (overTarget&&overTarget.dataset.allowdrop==='true') {
            util.removeClass(overTarget, 'over');
            this.props.dargEnd && this.props.dargEnd(window.$VIEW_STATE);
        } else {
            const {x,y} = this.start;
            target.style.transform = `translate(${x}px,${y}px)`;
            target.dataset.posX = x;
            target.dataset.posY = y;
            util.removeClass(target,'nodrop');
            util.removeClass(overTarget,'over');
        }
    }

    togglelock = (ev) => {
        ev.stopPropagation();
        const target = ev.target.parentNode;
        let { editable } = this.state;
        if (!editable) {
            const { width, height, left, top } = target.getBoundingClientRect();
            const offsetParentBound = target.offsetParent.getBoundingClientRect();
            target.dataset.resW = width;
            target.dataset.resH = height;
            target.dataset.posX = left - offsetParentBound.left;
            target.dataset.posY = top - offsetParentBound.top;
        }
        this.setState({ editable: !editable });
        this.props.togglelock && this.props.togglelock({ target: target, editable: !editable });
    }

    //编辑状态
    keydown = (ev) => {
        ev.stopPropagation();
        const { editable } = this.state;
        if (!editable) {
            return false;
        }
        //进入编辑尺寸
        if (ev.keyCode === 84 && ev.altKey) {
            if (util.hasClass(ev.target, "resize")) {
                util.removeClass(ev.target, "resize");
            } else {
                const { width, height } = ev.target.getBoundingClientRect();
                ev.target.dataset.resW = width;
                ev.target.dataset.resH = height;
                util.addClass(ev.target, "resize");
            }
        }
        //退出编辑尺寸
        if (ev.keyCode === 13 && ev.altKey) {
            util.removeClass(ev.target, "resize");
        }
    }

    //键盘移动
    keymove = (ev) => {
        ev.stopPropagation();
        const { editable } = this.state;
        if (!editable) {
            return false;
        }
        const target = ev.target;
        const move = () => {
            ev.preventDefault(ev);
            target.style.transform = `translate(${x}px,${y}px)`;
            target.dataset.posX = x;
            target.dataset.posY = y;
            window.$VIEW_STATE.x = x;
            window.$VIEW_STATE.y = y;
        }
        let x = Number(target.dataset.posX);
        let y = Number(target.dataset.posY);
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
            this.props.dargEnd && this.props.dargEnd(window.$VIEW_STATE);
        }
    }

    hover = (ev) => {
        const { clientX, clientY } = ev;
        ev.stopPropagation();
        let obj = document.elementsFromPoint(clientX, clientY).filter((el)=>util.hasClass(el, 'view'));
        if (obj[0]) {
            window.$_HOVER = obj[0];
            util.addClass(obj[0], "hover");
        }
    }

    onClick = (ev) => {
        ev.stopPropagation();
        console.log(this.props.children)
        this.props.onClick&&this.props.onClick();
    }

    onDoubleClick = (ev) => {
        this.props.onDoubleClick&&this.props.onDoubleClick(ev);
    }

    componentWillUpdate(nextProps, nextState) {
        if(nextProps.editable!==this.props.editable){
            this.setState({editable:nextProps.editable});
        }
    }

    componentDidMount() {
        //document.addEventListener('mousedown', this.dargStart, false);
        //document.addEventListener('mouseover', this.hover, false);
    }

    render() {
        const { className, resizeEnd, x, y, w, h,allowdrop } = this.props;
        const { editable } = this.state;
        const sizeW = parseInt(w,10) >= 0 ? { width: w } : {};
        const sizeH = parseInt(h,10) >= 0 ? { height: h } : {};
        return (
            <div
                onClick={this.onClick}
                onDoubleClick={this.onDoubleClick}
                onContextMenu={this.onMenu}
                style={{ transform: `translate(${x}px,${y}px)`, ...sizeW, ...sizeH }}
                tabIndex={0}
                onMouseOver={this.hover}
                onKeyDown={this.keymove}
                onKeyUp={this.keymoveEnd}
                data-editable={editable}
                data-allowdrop={allowdrop}
                onMouseOut={this.mouseout}
                onMouseDown={this.dargStart}
                className={`view ${className}`}>
                <span onClick={this.togglelock} className="editview" />
                {editable&&<ResizeW resizeEnd={resizeEnd} />}
                {this.props.children}
            </div>
        );
    }
}

export default View;