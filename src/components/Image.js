import React, { PureComponent } from 'react';
import { Icon, Spin, message } from 'antd';
import EditView from './EditView';

export default class Image extends PureComponent {

    state = {
        isUpload: false
    }

    componentWillUnmount() {
        if (window.isremove) {
            //console.log(this.props.index)
        }
    }


    imgUpload = (ev, callbck) => {
        this.setState({ isUpload: true })
        const { pageIndex,props:{srcId} } = this.props;
        const files = ev.target.files;
        if (files.length > 0) {
            let data = new FormData();
            data.append('img', files[0]);
            fetch(window.SERVER + '/image/' + pageIndex[0], {
                method: 'POST',
                body: data
            })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    return res
                }
            })
            .then((res) => {
                if (res.success) {
                    const _src = window.SERVER + `/resource/${pageIndex[1]}/${pageIndex[0]}/img/` + res.result.saveName;
                    const _srcId = res.result.id;
                    if(!srcId){
                        const w = res.result.width;
                        const h = res.result.height;
                        this.props.onChange && this.props.onChange({ w, h }, ['style']);
                    }
                    this.props.onChange && this.props.onChange({ src:_src, srcId:_srcId }, ['props']);                  
                    message.success('图片上传成功~');
                } else {
                    message.error('图片上传失败！' + res.statusText);
                }
                this.setState({ isUpload: false })
            })
        }
    }

    render() {
        const { props: { alt, src }, datas: { value }, index } = this.props;
        const { isUpload } = this.state;
        return (
            <EditView {...this.props} className="ImageView">
                <img draggable={false} style={{ opacity: isUpload ? .5 : 1 }} alt={value || alt} src={value || src} />
                <input disabled={isUpload} onChange={this.imgUpload} type="file" accept="image/*" id={"xFile-" + index} />
                <label className="img-upload" htmlFor={"xFile-" + index}>
                    {
                        isUpload ? <Spin spinning={isUpload} /> : <a><Icon type="upload" /></a>
                    }
                </label>
            </EditView>
        );
    }
}