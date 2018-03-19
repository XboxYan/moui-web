import React, { PureComponent } from 'react';
import Image from '../../components/Image';
import View from '../../components/View';
import Text from '../../components/Text';
import { ADD, CHANGE, MOVE } from '../../util/action';

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

    onFocus = (index) => () => {
        const { focus } = this.props.store;
        focus(index);
    }

    dragEnd = (index) => (pos, target) => {
        const { layout, updata } = this.props.store;
        const [_layout,focusindex] = MOVE(layout, pos, target, index, ['style']);
        updata(_layout,focusindex);
    }

    addCom = ({ type, x, y, index }) => {
        const { layout, updata } = this.props.store;
        const _layout = ADD(layout, index, type, { x, y });
        updata(_layout);
    }

    onChange = (index) => (key_value, type = ['style']) => {
        const { layout, updata } = this.props.store;
        const _layout = CHANGE(layout, index, key_value, type);
        updata(_layout);
    }

    loop = (data, m = '') => data.map((item, i) => {
        if (!item) {
            return null
        }
        const Tag = type[item.type];
        const key = m + '-' + i;
        let child = null;
        if (item.child && item.child.length) {
            child = this.loop(item.child, key)
        }
        const index = item.type + key;
        return (
            <Tag
                dragEnd={this.dragEnd(index)}
                onChange={this.onChange(index)}
                index={index}
                addCom={this.addCom}
                onFocus={this.onFocus(index)}
                onDrop={this.onDrop}
                key={index}
                style={item.style}
                props={item.props}>
                {child}
            </Tag>
        )
    });
    render() {
        const { layout } = this.props.store;
        return this.loop(layout.toJS());
    }
}
