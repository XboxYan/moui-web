import React, { PureComponent } from 'react';
import { Collapse, List, Icon, Tooltip } from 'antd';
const Panel = Collapse.Panel;

const baseCom = [
  {
    type: 'View',
    name: '盒子',
    desc: '通用容器，用于嵌套',
    ico: 'appstore-o'
  },
  {
    type: 'Image',
    name: '图片',
    desc: '用于显示图片',
    ico: 'picture'
  },
  {
    type: 'Text',
    name: '文本',
    desc: '用于显示文本',
    ico: 'file-text'
  },
]

const expCom = [
  {
    type: 'ListView',
    name: '列表',
    desc: '列表，通过接口生成',
    dynamic: true,
    ico: 'bars'
  },
  {
    type: 'TabView',
    name: '动态标签',
    desc: '标签页，通过接口生成',
    dynamic: true,
    ico: 'credit-card'
  },
  {
    type: 'TabView',
    name: '标签',
    desc: '标签页，可以自定义每一页的内容',
    ico: 'credit-card'
  },
]


class ComItem extends PureComponent {
  onDragStart = (ev) => {
    const { clientX, clientY } = ev;
    const { item } = this.props;
    const { left, top } = ev.target.getBoundingClientRect();
    ev.dataTransfer.setData("source", 'left');
    ev.dataTransfer.setData("type", item.type);
    ev.dataTransfer.setData("x", clientX - left);
    ev.dataTransfer.setData("y", clientY - top);
    if (item.dynamic) {
      ev.dataTransfer.setData("dynamic", true);
    }
  }
  render() {
    const { item,column=false } = this.props;
    return (
      <Tooltip placement={column?"right":"topLeft"} title={item.desc}>
        <div
          draggable={true}
          onDragStart={this.onDragStart}
          data-dynamic={item.dynamic}
          className="compItem"
        >
          <Icon style={{ fontSize: 20 }} type={item.ico} />
          {
            !column&&<div>{item.name}</div>
          }
        </div>
      </Tooltip>
    )
  }
}

export { baseCom, expCom, ComItem };

export default class ProjectList extends PureComponent {

  render() {
    return (
      <Collapse style={{ flex: 1 }} bordered={false} defaultActiveKey={['1', '2']}>
        <Panel header="基础组件" key="1" className="customPanelStyle">
          <List
            grid={{ gutter: 10, column: 3 }}
            dataSource={baseCom}
            renderItem={item => (
              <List.Item>
                <ComItem item={item} />
              </List.Item>
            )}
          />
        </Panel>
        <Panel header="扩展组件" key="2" className="customPanelStyle">
          <List
            grid={{ gutter: 10, column: 3 }}
            dataSource={expCom}
            renderItem={item => (
              <List.Item>
                <ComItem item={item} />
              </List.Item>
            )}
          />
        </Panel>
      </Collapse>
    );
  }
}