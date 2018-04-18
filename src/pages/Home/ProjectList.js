import React, { PureComponent, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { Menu, Icon, message, Spin, Modal, Button,Tooltip } from 'antd';
import { INIT } from '../../util/action';

const SubMenu = Menu.SubMenu;


const temp = (h) => ({
  "type": "View",
  "style": {
    "w": h * 1280 / 720,
    "h": h,
  },
  "props": {
    "editable": false,
    "allowdrop": true,
    "disabled": true
  },
  "datasource": {},
  "children": []
})

class ActionBtn extends PureComponent {
  constructor() {
    super();
    this.node = document.getElementById("header");
  }
  savePage = (callback) => {
    const { layout, pageIndex } = this.props.store;
    this.props.savePage(pageIndex[0], layout.toJS()[0],callback);
  }
  onView = () => {
    const {  pageIndex } = this.props.store;
    this.savePage(()=>{
      const url = window.SERVER + `/mofun.html?page=${pageIndex[1]}/1`
      window.open(url);
    })
  }
  render() {
    return createPortal(
      <div className="action-btn-group">
        <Tooltip title="预览"><Button type="primary" shape="circle" onClick={this.onView} icon="eye-o"/></Tooltip>
        <Tooltip title="保存"><Button type="primary" shape="circle" icon="save" onClick={this.savePage}/></Tooltip>
      </div>,
      this.node
    )
  }

}

export default class ProjectList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      pageIndex: props.store.pageIndex,
      Propject: []
    };
  }

  handleClick = (e) => {
    const keyPath = e.keyPath;
    const { pageIndex } = this.state;
    if (pageIndex[0] !== keyPath[0] || pageIndex[1] !== keyPath[1]) {
      const _this = this;
      Modal.confirm({
        title: '是否离开当前页',
        content: '当前页面将会自动保存',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          const { layout, jumpPage } = _this.props.store;
          _this.savePage(pageIndex[0], layout.toJS()[0]);
          _this.setState({ pageIndex: keyPath });
          _this.initPage(keyPath[0]);
          jumpPage(keyPath);
        }
      });
    }
  }

  fetchProject = async () => {
    return await fetch(window.SERVER + '/project')
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response;
        }
      })
      .then((data) => {
        if (data.success) {
          return data.result;
        } else {
          message.error(data.statusText);
        }
      })
  }

  fetchPage = async (id) => {
    return await fetch(window.SERVER + '/page/' + id)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response;
        }
      })
      .then((data) => {
        if (data.success) {
          return data.result;
        } else {
          message.error(data.statusText);
        }
      })
  }

  savePage = (id, data, callback) => {
    fetch(window.SERVER + '/layout/' + id, {
      method: 'PUT',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response;
        }
      })
      .then((data) => {
        if (data.success) {
          message.success('保存布局成功~');
          if(typeof callback === 'function'){
            callback();
          }
        } else {
          message.error('保存布局失败！' + data.statusText);
        }
      })
  }

  initPage = (id) => {
    fetch(window.SERVER + '/layout/' + id)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response;
        }
      })
      .then((data) => {
        if (data.success) {
          const { updata, focus } = this.props.store;
          let _layout;
          if (data.result && data.result.type) {
            _layout = INIT(data.result);
            message.success('载入布局完成~');
          } else {
            const _temp = temp(720);
            _layout = INIT(_temp);
            message.success('初始化布局完成~');
            this.savePage(id, _temp);
          }
          focus(null);
          updata(_layout);
        } else {
          message.error(data.statusText);
        }
      })
  }

  async componentDidMount() {
    let Propject = await this.fetchProject() || [];
    for (let i = 0; i < Propject.length; i++) {
      Propject[i].pages = await this.fetchPage(Propject[i].id);
    }
    const { initPage } = this.props.store;
    this.setState({ Propject });
    initPage(Propject);
    const { pageIndex } = this.state;
    this.initPage(pageIndex[0])
  }

  render() {
    const { Propject, pageIndex } = this.state;
    if (Propject.length === 0) {
      return <div className="project-loader"><Spin tip="正在加载工程" /></div>
    }
    return (
      <Fragment>
        <Menu
          onClick={this.handleClick}
          mode="inline"
          defaultSelectedKeys={[pageIndex[0]]}
          defaultOpenKeys={[pageIndex[1]]}
          selectedKeys={[pageIndex[0]]}
        >
          {
            Propject.map(el => (
              <SubMenu key={el.id} title={<span><Icon type="laptop" /><span>{el.name}</span></span>}>
                {

                  el.pages.map(item => {
                    if (item.isPage < 0) {
                      return null
                    } else {
                      return <Menu.Item key={item.id}>{item.name}</Menu.Item>
                    }
                  })
                }
              </SubMenu>
            ))
          }
        </Menu>
        <ActionBtn savePage={this.savePage} store={this.props.store} />
      </Fragment>
    );
  }
}