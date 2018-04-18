import React, { Component } from 'react';
import { message } from 'antd';
import Image from '../../components/Image';
import View from '../../components/View';
import Text from '../../components/Text';
import ListView from '../../components/ListView';
import TabView from '../../components/TabView';
import { ADD, CHANGE, MOVE, COPY, DELETE, ADDTAB, DELTAB } from '../../util/action';

const type = {
    'View': View,
    'Text': Text,
    'Image': Image,
    'ListView': ListView,
    'TabView': TabView,
}

export default class Center extends Component {

    copyData = null;

    onClick = (index) => (ev) => {
        if (ev.target.tagName !== 'TEXTAREA') {
            const { focus, indexList, index: $index } = this.props.store;
            if (ev.shiftKey && $index) {
                if ($index.split('>')[0] === index.split('>')[0]) {
                    const i = indexList.indexOf(index);
                    if (i < 0) {
                        focus([...indexList, index], true);
                    } else {
                        let _indexList = [...indexList]
                        _indexList.splice(i, 1);
                        focus(_indexList, true);
                    }
                } else {
                    message.error('必须选择同一类型组件');
                }
            } else {
                focus([index], true);
            }
        }
    }

    onFocus = (index) => () => {
        //const { focus } = this.props.store;
        //focus(index);
    }

    onCopy = () => {
        const { current } = this.props.store;
        message.success('组件已复制');
        this.copyData = current;
    }

    onPaste = (pos, index) => {
        if (this.copyData) {
            const { layout, updata } = this.props.store;
            const _layout = COPY(layout, index, this.copyData, { x: pos.x, y: pos.y });
            updata(_layout);
        }
    }

    onPasteTips = () => {
        if (this.copyData) {
            message.error('该组件内不允许置入其它组件');
        }
    }

    dragEnd = (index) => (pos, target) => {
        //window.isremove = false;
        const { layout, updata } = this.props.store;
        const [_layout, focusindex] = MOVE(layout, pos, target, index, ['style']);
        updata(_layout,focusindex);
        //console.log(focusindex)
        document.getElementById(focusindex).focus();
    }

    addCom = ({ type, x, y, index, dynamic }) => {
        const { layout, updata } = this.props.store;
        const [_layout, focusindex] = ADD(layout, index, type, { x, y }, dynamic);
        updata(_layout,focusindex);
    }

    addTab = (index) => (tabIndex) => {
        const { layout, updata } = this.props.store;
        const [_layout, focusindex] = ADDTAB(layout, index, tabIndex);
        updata(_layout, focusindex);
    }

    delTab = (index) => (tabIndex,isLast) => {
        const { layout, updata } = this.props.store;
        const _layout = DELTAB(layout, index, tabIndex);
        if (isLast) {
            const i = 'View>' + (index.split('>')[1]) + '@' + (tabIndex-1);
            updata(_layout,i);
        } else {
            updata(_layout);
        }
    }

    addDatas = (type) => ({ name, value, index }) => {
        const { layout, updata } = this.props.store;
        if (type === 'Text' || type === 'Image') {
            const _layout = CHANGE(layout, index, { 'props': name, value }, ['datas']);
            updata(_layout);
        } else {
            //const _layout = CHANGE(layout, index, { 'paramsDy': [{ name, value }] }, ['datasource']);
            //updata(_layout);
        }
    }

    onChange = (index) => (key_value, type = ['style']) => {
        const { layout, updata } = this.props.store;
        const _layout = CHANGE(layout, index, key_value, type);
        updata(_layout);
    }

    onDelete = (index) => () => {
        window.isremove = true;
        const { layout, updata } = this.props.store;
        const _layout = DELETE(layout, index);
        const focusindex = 'View>'+index.slice(0, -2).split('>')[1];
        updata(_layout, focusindex);
        message.success('该组件已删除');
    }

    shouldComponentUpdate (nextProps) { 
        return this.props.store.layout !== nextProps.store.layout || this.props.store.index !== nextProps.store.index || this.props.store.indexList.length !== nextProps.store.indexList.length; 
    }

    loop = (data, m = '', s = '-', innerView) => data.map((item, i) => {
        if (!item) {
            return null
        }
        const Tag = type[item.type];
        let key = m + s + i;
        let children = null;
        if (item.type === 'ListView') {
            children = this.loop(item.item, key, '~', true);
        } else if (item.type === 'TabView') {
            children = [this.loop(item.tabs, key, '@', true), this.loop(item.contents, key, '#', true)];
        } else {
            if (item.children && item.children.length) {
                children = this.loop(item.children, key);
            }
        }
        const index = item.type + '>' + key;
        const { pageIndex, indexList } = this.props.store;
        const selected = indexList.indexOf(index) >= 0;
        return (
            <Tag
                {...item}
                dragEnd={this.dragEnd(index)}
                onChange={this.onChange(index)}
                innerView={innerView}
                index={index}
                pageIndex={pageIndex}
                selected={selected}
                addCom={this.addCom}
                addDatas={this.addDatas(item.type)}
                addTab={this.addTab(index)}
                delTab={this.delTab(index)}
                //onFocus={this.onClick(index)}
                onClick={this.onClick(index)}
                onDrop={this.onDrop}
                onDelete={this.onDelete(index)}
                onPaste={item.props.allowdrop ? this.onPaste : this.onPasteTips}
                onCopy={this.onCopy}
                onSet={this.onChange(index)}
                key={index}>
                {children}
            </Tag>
        )
    });
    render() {
        const { layout } = this.props.store;
        return this.loop(layout.toJS());
    }
}
