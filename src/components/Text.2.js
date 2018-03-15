import React, { PureComponent } from 'react';
import View from './View';
import {StoreContext} from '../store';
import { Input } from 'antd';
import Draggble from './Draggble';
import AddStyle from './AddStyle';

@Draggble({allowDrap:false})
@AddStyle
export default class Text extends PureComponent {
    static defaultProps = {
        text: '默认文本',

    }
    constructor(props) {
        super(props);
        this.state = {
            contentEditable: false,
            text: props.text,
            style: props.style
        };
    }

    componentDidMount() {
        //this.props.onDragEnd()
    }

    render() {
        const { text } = this.state;
        return (

            <div style={{...this.props.style},{zIndex:100,width: 100,height: 100,background: 'aquamarine'}} >{text}</div>
        );
    }
}

