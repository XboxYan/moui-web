import React, { PureComponent } from 'react';
import EditView from './EditView';

export default class Image extends PureComponent {

    render() {
        const { props:{alt,src},datas:{value}} = this.props;
        return (
            <EditView {...this.props} className="ImageView">
                <img draggable={false} alt={value||alt} src={value||src} />
            </EditView>
        );
    }
}

