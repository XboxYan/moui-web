import React, { PureComponent } from 'react';
import EditView from './EditView';

export default class Image extends PureComponent {

    render() {
        const {alt,src} = this.props.props;
        return (
            <EditView {...this.props}>
                <img draggable={false} alt={alt} src={src} />
            </EditView>
        );
    }
}

