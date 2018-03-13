import React, { PureComponent } from 'react';
import Draggble from './Draggble';

@Draggble
export default class View extends PureComponent {

    render() {
        const { w,h } = this.props;
        return (
            <div {...this.props} className='view'>{this.props.children}</div>
        );
    }
}

