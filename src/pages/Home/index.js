import React, { PureComponent } from 'react';
import { Layout, Icon, Breadcrumb, Button } from 'antd';
import ProjectList from './ProjectList';
import CompoList from './CompoList';
import PropsList from './PropsList';
import Center from './Center';
import StoreProvider, { StoreContext } from '../../store';
const { Header, Footer, Sider, Content } = Layout;

class TreeNode extends PureComponent {
  paseTree = (path) => {
    let tree = [];
    let [type, _path] = path.split('>-0');
    let $path = ((_path.replace(/-/g, 'View').replace(/~/g, 'ListView').replace(/@/g, 'TabView').replace(/#/g, 'TabView').replace(/[0-9]/g, ',')) + type).split(',');
    $path.forEach((el, i) => {
      tree.push({
        name: i === 0 ? '根节点' : el,
        index: el + '>-0' + _path.slice(0, i * 2)
      })
    })
    return tree;
  }
  onFocus = (index) => () => {
    const { focus } = this.props.store;
    document.getElementById(index).focus();
    focus(index);
  }
  render() {
    const { index } = this.props.store;
    if (!index) {
      return null;
    }
    const tree = this.paseTree(index);
    return (
      <Breadcrumb separator=">">
        {
          tree.map((el, i) => <Breadcrumb.Item key={i} data-current={i === tree.length - 1}><a onClick={this.onFocus(el.index)}>{el.name}</a></Breadcrumb.Item>)
        }
      </Breadcrumb>
    )
  }
}

export default class Index extends PureComponent {

  state = {
    isGrap: false,
    fullscreen: false
  }

  target = null;

  screen = null;

  setFull = () => {
    const { fullscreen } = this.state;
    if (fullscreen) {
      document.webkitCancelFullScreen();
    } else {
      this.screen.webkitRequestFullscreen && this.screen.webkitRequestFullscreen();
    }
  }

  fullscreenchange = (ev) => {
    const { fullscreen } = this.state;
    this.setState({ fullscreen: !fullscreen });
  }

  onkeydown = (ev) => {
    if (ev.keyCode === 32) {
      if (ev.target.tagName !== 'TEXTAREA' && ev.target.tagName !== 'INPUT') {
        ev.preventDefault();
        ev.stopPropagation();
        this.setState({ isGrap: true })
      }
    }
  }

  onkeyup = (ev) => {
    if (ev.keyCode === 32) {
      this.setState({ isGrap: false })
    }
  }

  dragStart = (ev) => {
    if (this.state.isGrap) {
      const { clientX, clientY } = ev;
      const { left, top } = ev.target.getBoundingClientRect();
      const offsetParent = ev.target.offsetParent;
      const offsetParentBound = offsetParent.getBoundingClientRect();
      let _left = offsetParentBound.left + offsetParent.scrollLeft;
      let _top = offsetParentBound.top + offsetParent.scrollTop;
      const _X = clientX - left;
      const _Y = clientY - top;
      document.onmousemove = (event) => this.drag(event, { _X, _Y, _left, _top });
      document.onmouseup = this.dragEnd;
      return false;
    }
  }

  drag = (event, { _X, _Y, _left, _top }) => {
    event.stopPropagation();
    const { clientX, clientY } = event;
    const x = clientX - _X - _left;
    const y = clientY - _Y - _top;
    this.target.style.transform = `translate3d(${x}px,${y}px,0)`;
  }

  dragEnd = (ev) => {
    document.onmousemove = null;
    document.onmouseup = null;
  }

  componentDidMount() {
    this.target = document.getElementById('layout-target');
    this.screen = document.getElementById('screen');
    document.addEventListener('keydown', this.onkeydown, false);
    document.addEventListener('keyup', this.onkeyup, false);
    document.addEventListener('webkitfullscreenchange', this.fullscreenchange, false)
  }

  render() {
    const { isGrap, fullscreen } = this.state;
    return (
      <StoreProvider>
        <Layout>
          <Header className="header">
            <div className="logo"><Icon type="cloud" /> Coship</div>
          </Header>
          <Layout>
            <Sider
              width={220}
              collapsedWidth={0}
              collapsible={true}
            >
              <StoreContext.Consumer>
                {
                  context => <ProjectList store={context} />
                }
              </StoreContext.Consumer>
              <CompoList />
            </Sider>
            <Layout>
              <Content id="screen" data-full={fullscreen}>
                <div
                  data-grap={isGrap}
                  tabIndex={0}
                  id="layout-target"
                  onMouseDown={this.dragStart}
                  className="layout-wrap">
                  <StoreContext.Consumer>
                    {
                      context => <Center store={context} />
                    }
                  </StoreContext.Consumer>
                </div>
                <Button className="fullscrren-btn" type="primary" onClick={this.setFull} shape="circle" ><Icon type={fullscreen ? "shrink" : "arrows-alt"} /></Button>
              </Content>
              <Footer>
                <StoreContext.Consumer>
                  {
                    context => <TreeNode store={context} />
                  }
                </StoreContext.Consumer>
              </Footer>
            </Layout>
            <Sider width={260}>
              <StoreContext.Consumer>
                {
                  context => <PropsList store={context} />
                }
              </StoreContext.Consumer>
            </Sider>
          </Layout>
        </Layout>
      </StoreProvider>
    );
  }
}
