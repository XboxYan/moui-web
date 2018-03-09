import React, { PureComponent } from 'react';
import View from './View';
import {StoreContext} from '../store';
import { Input } from 'antd';

export default class Text extends PureComponent {
    static defaultProps = {
        text: '默认文本',
        multiline: true
    }
    constructor(props) {
        super(props);
        this.state = {
            contentEditable: false,
            text: props.text
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

    render() {
        const { multiline } = this.props;
        const { contentEditable, text } = this.state;
        return (

            <View allowdrop={false} {...this.props} onDoubleClick={this.onDoubleClick} editable={!contentEditable}>
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
            </View>
        );
    }
}

