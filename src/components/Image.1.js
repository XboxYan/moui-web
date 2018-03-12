import React, { PureComponent } from 'react';
import View from './View';
import src from '../img/default_img.png';

export default class Image extends PureComponent {
    static defaultProps = {
        alt: '',
        src: src
    }
    constructor(props) {
        super(props);
        this.state = {
            src: props.src,
            alt: props.alt,
            style: props.style
        };
    }
    onFocus = () => {
        this.props.onFocus&&this.props.onFocus(this);  
    }
    render() {
        const {alt,src,style} = this.state;
        return (
            <View allowdrop={false} style={style} onFocus={this.onFocus}>
                <img draggable={false} alt={alt} src={src} />
            </View>
        );
    }
}

