import React, { PureComponent } from 'react';
import View from './View';
import src from '../img/default_img.png';

export default class Image extends PureComponent {
    static defaultProps = {
        alt: '',
        src: src
    }
    render() {
        const {alt,src} = this.props;
        return (
            <View allowchild={false} draggable={false} alt={alt} src={src}  {...this.props} >
                <img draggable={false} alt={alt} src={src} />
            </View>
        );
    }
}

