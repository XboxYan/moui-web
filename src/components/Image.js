import React, { PureComponent } from 'react';
import EditView from './EditView';

export default class Image extends PureComponent {

    render() {
        const { props:{alt,src},datas:{value}} = this.props;
        const style = {...this.props.style,...{overflow:'hidden'}}
        return (
            <EditView {...this.props} style={style}>
                <img draggable={false} alt={value||alt} src={value||src} />
            </EditView>
        );
    }
}

