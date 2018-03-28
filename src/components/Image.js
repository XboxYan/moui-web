import React, { PureComponent } from 'react';
import { Icon, Spin } from 'antd';
import EditView from './EditView';

export default class Image extends PureComponent {

    state = {
        isUpload: false
    }

    componentWillUnmount() {
        if (window.isremove) {
            console.log(this.props.index)
        }
    }

    imgUpload = (ev) => {
        this.setState({ isUpload: true })
        this.props.imgUpload && this.props.imgUpload(ev, (res) => {
            if(res.success){
                this.props.onChange && this.props.onChange({ src: window.SERVER + '/resource/1/1/img/' + res.result.saveName, srcId: res.result.id }, ['props']);
                this.props.onChange && this.props.onChange({ w: res.result.width, h: res.result.height }, ['style']);
            }
            this.setState({ isUpload: false })  
        })
    }

    render() {
        const { props: { alt, src }, datas: { value }, index } = this.props;
        const { isUpload } = this.state;
        return (
            <EditView {...this.props} className="ImageView">
                <img draggable={false} style={{opacity:isUpload?.5:1}} alt={value || alt} src={value || src} />
                <input disabled={isUpload} onChange={this.imgUpload} type="file" accept="image/*" id={"xFile-" + index} />
                <label className="img-upload" htmlFor={"xFile-" + index}>
                    {
                        isUpload?<Spin spinning={isUpload} />:<a><Icon type="upload" /></a>
                    }
                </label>  
            </EditView>
        );
    }
}