import React, { PureComponent } from 'react';
import EditView from './EditView';
import { Input } from 'antd';

export default class Text extends PureComponent {

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
        const {text,multiline} = this.props.props;
        return (

            <EditView {...this.props} onDoubleClick={this.onDoubleClick}>
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

