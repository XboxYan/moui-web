import React, { PureComponent } from 'react';
import Image from '../../components/Image';
import View from '../../components/View';
import Text from '../../components/Text';
import {ADD,CHANGE,MOVE} from '../../util/action';

const type = {
    'View': View,
    'Text': Text,
    'Image': Image,
  }

export default class Center extends PureComponent {
    onDragEnd = (A, x, y) => {
        console.log(A, x, y)
    }

    onDrop = (A, x, y) => {
        console.log(A, x, y)
    }

    onFocus = (A) => {
        console.log(A)
    }

    dragEnd = ({ x, y },target,index,path) => {
        const {layout,updata} = this.props.store;
        console.log(layout,{ x, y },target,index,path)
        const _layout = MOVE(layout,{ x, y },target,index,path);
        updata(_layout);
    }

    addCom = ({ type, x, y, index }) => {
        const {layout,updata} = this.props.store;
        //paseTree(layout,index)
        const _layout = ADD(layout,index,type,{x,y});
        updata(_layout);
        //console.log(type, x, y, index,layout)
    }

    onChange = (value,index,path) => {
        const {layout,updata} = this.props.store;
        const _layout = CHANGE(layout,index,value,path);
        updata(_layout);
    }

    loop = (data, m = 'tree') => data.map((item, i) => {
        const Tag = type[item.type];
        const key = m + '-' + i;
        let child = null;
        if (item.child && item.child.length) {
            child = this.loop(item.child, key)
        }
        return (
            <Tag
                dragEnd={this.dragEnd}
                onChange={this.onChange}
                index={key}
                addCom={this.addCom}
                onFocus={this.onFocus}
                onDrop={this.onDrop}
                key={key}
                style={item.style}
                props={item.props}>
                {child}
            </Tag>
        )
    });
    render() {
        const {layout} = this.props.store;
        return this.loop(layout);
    }
}
