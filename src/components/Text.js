import React, { PureComponent } from 'react';
import EditView from './EditView';
import { Input,message } from 'antd';

export default class Text extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            contentEditable: false,
        };
    }

    onDoubleClick = () => {
        const { datas:{props}} = this.props;
        if(props){
            message.error('使用外部数据无法修改');
        }else{
            this.setState({ contentEditable: true });
            this.props.onChange && this.props.onChange({editable: false},['props']);
        }
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
        const { props:{text,multiline},datas:{value}} = this.props;
        
        return (

            <EditView {...this.props} onDoubleClick={this.onDoubleClick}>
                {
                    contentEditable ?
                        <Input autoFocus={true} onBlur={this.onBlur} defaultValue={text} />
                        :
                        <div className={multiline ? '' : 'els'}>{value||text}</div>
                }
            </EditView>
        );
    }
}

