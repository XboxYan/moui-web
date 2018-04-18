import React, { PureComponent, Fragment } from 'react';
import PropsPane from './PropsPane';

export default class extends PureComponent {
  target = null;

  state = {
    isMove: false
  }

  pos = {
    x: 0,
    y: 0
  }

  dragStart = (ev) => {
    const { clientX, clientY } = ev;
    const { x, y } = this.pos;
    const _X = clientX - x;
    const _Y = clientY - y;
    document.onmousemove = (event) => this.drag(event, { _X, _Y });
    document.onmouseup = this.dragEnd;
    this.setState({ isMove: true });
    return false;
  }

  drag = (event, { _X, _Y }) => {
    event.stopPropagation();
    const { clientX, clientY } = event;
    const x = clientX - _X;
    const y = clientY - _Y;
    this.pos = { x, y };
    this.target.style.transform = `translate3d(${x}px,${y}px,0)`;
  }

  dragEnd = (ev) => {
    this.setState({ isMove: false });
    document.onmousemove = null;
    document.onmouseup = null;
  }

  componentDidMount() {
    this.target = document.getElementById('full-props');
  }

  render() {
    const { current } = this.props.store;
    const { isMove } = this.state;
    return (
      <div id="full-props" className="full-card-container" data-show={this.props.show}>
        {
          current &&
            <Fragment>
              <h2 className="full-props-title" data-ismove={isMove} onMouseDown={this.dragStart} >{current.type}</h2>
              <div className="full-props-con" data-disabled={isMove} >
                <PropsPane {...this.props}/>
              </div>
            </Fragment>
        }
      </div>
    );
  }
}