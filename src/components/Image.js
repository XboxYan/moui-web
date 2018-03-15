import React, { PureComponent } from 'react';
import EditView from './EditView';
import src from '../img/default_img.png';

const defaultProps = {
    alt: '',
    src: src
}

export default class Image extends PureComponent {
    static defaultProps = {
        ...defaultProps
    }

    onFocus = () => {
        this.props.onFocus&&this.props.onFocus(this);  
    }
    
    render() {
        const {alt,src} = {...defaultProps,...this.props.props};
        console.log(src)
        return (
            <EditView {...this.props} allowdrop={false} onFocus={this.onFocus}>
                <img draggable={false} alt={alt} src={src} />
            </EditView>
        );
    }
}

