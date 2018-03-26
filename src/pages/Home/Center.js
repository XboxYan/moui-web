import React, { PureComponent } from 'react';
import { message } from 'antd';
import Image from '../../components/Image';
import View from '../../components/View';
import Text from '../../components/Text';
import ListView from '../../components/ListView';
import TabView from '../../components/TabView';
import { ADD, CHANGE, MOVE, COPY, DELETE, ADDTAB,DELTAB } from '../../util/action';

const type = {
    'View': View,
    'Text': Text,
    'Image': Image,
    'ListView': ListView,
    'TabView': TabView,
}

export default class Center extends PureComponent {

    copyData = null;

    onFocus = (index) => () => {
        const { focus } = this.props.store;
        focus(index);
    }

    onCopy = () => {
        const {current} = this.props.store;
        message.success('组件已复制');
        this.copyData = current;
    }

    onPaste = (pos,index) => {
        if(this.copyData){
            const { layout, updata } = this.props.store;
            const _layout = COPY(layout, index, this.copyData, {x:pos.x,y:pos.y});
            updata(_layout);
        }
    }

    onPasteTips = () => {
        if(this.copyData){
            message.error('该组件内不允许置入其它组件');
        }
    }

    dragEnd = (index) => (pos, target) => {
        const { layout, updata } = this.props.store;
        const [_layout,focusindex] = MOVE(layout, pos, target, index, ['style']);
        updata(_layout,focusindex);
        document.getElementById(focusindex).focus();
    }

    addCom = ({ type, x, y, index,dynamic }) => {
        const { layout, updata } = this.props.store;
        const _layout = ADD(layout, index, type, { x, y },dynamic);
        updata(_layout);
    }

    addTab = (index) => (tabIndex) => {
        const { layout, updata } = this.props.store;
        const _layout = ADDTAB(layout, index, tabIndex);
        updata(_layout);
    }

    delTab = (index) => (tabIndex) => {
        const { layout, updata } = this.props.store;
        const _layout = DELTAB(layout, index, tabIndex);
        updata(_layout);
    }

    addDatas = (type) => ({ name, value, index }) => {
        const { layout, updata } = this.props.store;
        if(type==='Text'||type==='Image'){
            const _layout = CHANGE(layout, index, {'props':name,value}, ['datas']);
            updata(_layout);
        }else{
            const _layout = CHANGE(layout, index, {'paramsDy':[{name,value}]}, ['datasource']);
            updata(_layout);
        }
    }

    onChange = (index) => (key_value, type = ['style']) => {
        const { layout, updata } = this.props.store;
        const _layout = CHANGE(layout, index, key_value, type);
        updata(_layout);
    }

    onDelete = (index) => () => {
        const { layout, updata } = this.props.store;
        const _layout = DELETE(layout, index);
        updata(_layout,index.slice(0,-2));
        message.success('该组件已删除');
    }

    loop = (data, m = '',s='-',innerView) => data.map((item, i) => {
        if (!item) {
            return null
        }
        const Tag = type[item.type];
        let key = m + s + i;
        let child = null;
        if(item.type==='ListView'){
            child = this.loop(item.item, key,'~',true);
        }else if(item.type==='TabView'){
            child = [this.loop(item.tabs, key,'@',true),this.loop(item.contents, key,'#',true)];
        }else{
            if (item.child && item.child.length) {
                child = this.loop(item.child, key);
            }
        }   
        const index = item.type +'>' + key;
        return (
            <Tag
                {...item}
                dragEnd={this.dragEnd(index)}
                onChange={this.onChange(index)}
                innerView={innerView}
                index={index}
                addCom={this.addCom}
                addDatas={this.addDatas(item.type)}
                addTab={this.addTab(index)}
                delTab={this.delTab(index)}
                onFocus={this.onFocus(index)}
                onDrop={this.onDrop}
                onDelete={this.onDelete(index)}
                onPaste={item.props.allowdrop?this.onPaste:this.onPasteTips}
                onCopy={this.onCopy}
                onSet={this.onChange(index)}
                key={index}>
                {child}
            </Tag>
        )
    });
    render() {
        const { layout } = this.props.store;
        return this.loop(layout.toJS());
    }
}
