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

    dragEnd = ({x,y},target) => {
        const {index} = this.props;
        this.props.dragEnd&&this.props.dragEnd({x,y},target,index,['style']);  
    }
    
    render() {
        const {alt,src} = {...defaultProps,...this.props.props};
        return (
            <EditView {...this.props} dragEnd={this.dragEnd} allowdrop={false} onFocus={this.onFocus}>
                <img draggable={false} alt={alt} src={src} />
            </EditView>
        );
    }
}

