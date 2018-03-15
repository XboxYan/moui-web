import React, { PureComponent } from 'react';
import EditView from './EditView';
import {StoreContext} from '../store';
import { Input } from 'antd';
import Draggble from './Draggble';


export default class Text extends PureComponent {
    static defaultProps = {
        text: '默认文本',
        multiline: true
    }
    constructor(props) {
        super(props);
        this.state = {
            contentEditable: false,
            multiline:props.multiline,
            text: props.text,
            style: props.style
        };
    }

    onDoubleClick = () => {
        this.setState({ contentEditable: true });

    }

    onBlur = (ev) => {
        const { value } = ev.target;
        this.setState({
            contentEditable: false,
            text: value
        });
        this.props.onChange && this.props.onChange(value);
    }

    onFocus = () => {
        this.props.onFocus&&this.props.onFocus(this);  
    }

    dragEnd = (a) => {
        console.log(a)
        const {x,y,_x,_y,w,h} = a.state;
        // this.setState({
        //     style:{x,y,_x,_y,w,h}
        // })
    }

    render() {
        const { contentEditable, text, style, multiline } = this.state;
        return (

            <EditView {...this.props} allowdrop={false} onDoubleClick={this.onDoubleClick} editable={!contentEditable}>
                {
                    contentEditable ?
                        <Input autoFocus={true} onBlur={this.onBlur} defaultValue={text} />
                        :
                        <StoreContext.Consumer>
                            {context => (
                                <div style={{ color: context.color }} className={multiline ? '' : 'els'}>{text}</div>
                            )}
                        </StoreContext.Consumer>

                }
            </EditView>
        );
    }
}

