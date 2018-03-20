import React, { PureComponent } from 'react';
import EditView from './EditView';
import src from '../img/default_img.png';

const defaultProps = {
    props:{
        alt: '',
        src: src
    }
}

export default class Image extends PureComponent {
    static defaultProps = {
        ...defaultProps
    }

    render() {
        const {alt,src,editable} = {...defaultProps.props,...this.props.props};
        return (
            <EditView {...this.props} allowdrop={false}>
                <img draggable={false} alt={alt} src={src} />
            </EditView>
        );
    }
}

