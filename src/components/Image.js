import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import EditView from './EditView';

export default class Image extends PureComponent {

    render() {
        const { props:{alt,src},datas:{value},index} = this.props;
        return (
            <EditView {...this.props} className="ImageView">
                <img draggable={false} alt={value||alt} src={value||src} />
                <input type="file" accept="image/*" id={"xFile-"+index} />
                <label className="img-upload" htmlFor={"xFile-"+index}><a><Icon type="upload" /></a></label>
            </EditView>
        );
    }
}

