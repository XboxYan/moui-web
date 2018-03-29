import React, { PureComponent } from 'react';
import { Tabs,Alert } from 'antd';
import PropsPane from './PropsPane';
import StylesPane from './StylesPane';
import IndentsPane from './IndentsPane';
import 'rc-color-picker/assets/index.css';
const TabPane = Tabs.TabPane;

export default class PropsList extends PureComponent {

    render() {
        const {current} = this.props.store;
        if(!current){
            return <div className="flex-center"><Alert message="未选择组件" type="warning" /></div>;
        }
        return (
            <div className="card-container">
                <Tabs type="card" className="tab-container">
                    <TabPane tab="属性" key="1"><PropsPane {...this.props} /></TabPane>
                    <TabPane tab="数据源" key="2"><StylesPane {...this.props} /></TabPane>
                    <TabPane tab="跳转" key="3"><IndentsPane {...this.props} /></TabPane>
                </Tabs>
            </div>
        );
    }
}