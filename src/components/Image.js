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
        this.props.imgUpload && this.props.imgUpload(ev, (data) => {
            this.setState({ isUpload: false })
            this.props.onChange && this.props.onChange({ src: window.SERVER + '/resource/1/1/img/' + data.saveName, srcId: data.id }, ['props']);
        })
    }

    render() {
        const { props: { alt, src }, datas: { value }, index } = this.props;
        const { isUpload } = this.state;
        return (
            <EditView {...this.props} className="ImageView">
                <img draggable={false} alt={value || alt} src={value || src} />
                <input disabled={isUpload} onChange={this.imgUpload} type="file" accept="image/*" id={"xFile-" + index} />
                <label className="img-upload" htmlFor={"xFile-" + index}><a><Icon type="upload" /></a></label>
                <Spin className="img-loader" spinning={isUpload} />
            </EditView>
        );
    }
}