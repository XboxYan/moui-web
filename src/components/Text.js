import React, { PureComponent } from 'react';
import EditView from './EditView';
import { Input } from 'antd';

const defaultProps = {
    props:{
        text: '默认文本',
        multiline: true
    }
}

export default class Text extends PureComponent {
    static defaultProps = {
        ...defaultProps
    }
    constructor(props) {
        super(props);
        this.state = {
            contentEditable: false,
        };
    }

    onDoubleClick = () => {
        this.setState({ contentEditable: true });
        this.props.onChange && this.props.onChange({editable: false},['props']);
    }

    onBlur = (ev) => {
        const { value } = ev.target;
        this.setState({
            contentEditable: false,
        });
        this.props.onChange && this.props.onChange({text:value,editable:true},['props']);
    }

    render() {
        const { contentEditable } = this.state;
        const {text,multiline} = {...defaultProps.props,...this.props.props};
        const style = {...this.props.style,...{overflow:'visible'}}
        return (

            <EditView {...this.props} style={style} allowdrop={false} onDoubleClick={this.onDoubleClick}>
                {
                    contentEditable ?
                        <Input autoFocus={true} onBlur={this.onBlur} defaultValue={text} />
                        :
                        <div className={multiline ? '' : 'els'}>{text}</div>
                }
            </EditView>
        );
    }
}

