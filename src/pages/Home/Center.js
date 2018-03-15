import React, { PureComponent } from 'react';
import StoreProvider, { StoreContext } from '../../store';
import Image from '../../components/Image';
import View from '../../components/View';
import Text from '../../components/Text';
import {ADD} from '../../util/action';

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

    dragEnd = ({ x, y }) => {
        console.log(x, y)

    }

    addCom = ({ type, x, y, index }) => {
        const {layout,updata} = this.props.store;
        //paseTree(layout,index)
        const _layout = ADD(layout,index,type,{x,y});
        updata(_layout);
        //console.log(type, x, y, index,layout)
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
