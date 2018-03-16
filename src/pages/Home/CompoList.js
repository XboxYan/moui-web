import React, { PureComponent } from 'react';
import { Collapse, List, Icon } from 'antd';
const Panel = Collapse.Panel;

const baseCom = [
  {
    type: 'View',
    name: '盒子',
    ico: 'appstore-o'
  },
  {
    type: 'Image',
    name: '图片',
    ico: 'picture'
  },
  {
    type: 'Text',
    name: '文本',
    ico: 'file-text'
  },
]

const expCom = [
  {
    type: 'List',
    name: '列表',
    ico: 'bars'
  },
]


class ComItem extends PureComponent {
  onDragStart = (ev) => {
    const { clientX, clientY } = ev;
    const { item } = this.props;
    const { left, top } = ev.target.getBoundingClientRect();
    ev.dataTransfer.setData("source",'left');
    ev.dataTransfer.setData("type",item.type);
    ev.dataTransfer.setData("x",clientX - left);
    ev.dataTransfer.setData("y",clientY - top);
  }
  render() {
    const { item } = this.props;
    return (
      <div
        draggable={true}
        onDragStart={this.onDragStart}
        className="compItem"
      >
        <Icon style={{ fontSize: 20 }} type={item.ico} />
        <div>{item.name}</div>
      </div>
    )
  }
}

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