import React, { PureComponent } from 'react';
import EditView from './EditView';

export default class Image extends PureComponent {

    render() {
        const {alt,src} = this.props.props;
        const style = {...this.props.style,...{overflow:'hidden'}}
        return (
            <EditView {...this.props} style={style}>
                <img draggable={false} alt={alt} src={src} />
            </EditView>
        );
    }
}

