import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;

export default class PropsList extends PureComponent {
    render() {
        return (
            <div className="card-container">
                <Tabs type="card">
                    <TabPane tab="选项卡一" key="1">选项卡一内容</TabPane>
                    <TabPane tab="选项卡二" key="2">选项卡二内容</TabPane>
                    <TabPane tab="选项卡三" key="3">选项卡三内容</TabPane>
                </Tabs>
            </div>
        );
    }
}