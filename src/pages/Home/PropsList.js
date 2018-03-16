import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import PropsPane from './PropsPane';
import StylesPane from './StylesPane';
const TabPane = Tabs.TabPane;

export default class PropsList extends PureComponent {
    render() {
        const {layout,current} = this.props.store;
        if(!current){
            return <div>未选择组件</div>
        }
        return (
            <div className="card-container">
                <Tabs type="card" size={'small'}>
                    <TabPane tab="属性" key="1"><PropsPane {...this.props} /></TabPane>
                    <TabPane tab="样式" key="2"><StylesPane {...this.props} /></TabPane>
                </Tabs>
            </div>
        );
    }
}