import React, { PureComponent } from 'react';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class SiderLeft extends PureComponent {
  handleClick = (e) => {
    console.log('click ', e);
  }
  render() {
    return (
      <Menu
        style={{maxHeight:'60%'}}
        onClick={this.handleClick}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
      >
        <SubMenu key="sub1" title={<span><Icon type="laptop" /><span>项目一</span></span>}>
          <MenuItemGroup key="g1" title="首页">
            <Menu.Item key="1">页面 1</Menu.Item>
            <Menu.Item key="2">页面 2</Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup key="g2" title="详情页">
            <Menu.Item key="3">Option 3</Menu.Item>
            <Menu.Item key="4">Option 4</Menu.Item>
          </MenuItemGroup>
        </SubMenu>
        <SubMenu key="sub2" title={<span><Icon type="laptop" /><span>项目二</span></span>}>
          <MenuItemGroup key="g1" title="首页">
            <Menu.Item key="5">页面 1</Menu.Item>
            <Menu.Item key="6">页面 2</Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup key="g2" title="详情页">
            <Menu.Item key="7">Option 3</Menu.Item>
            <Menu.Item key="8">Option 4</Menu.Item>
          </MenuItemGroup>
        </SubMenu>
      </Menu>
    );
  }
}