import React, { PureComponent } from 'react';
import Draggble from './Draggble';
import AddStyle from './AddStyle';

@Draggble()
@AddStyle
export default class View extends PureComponent {

    defultStyle = {
        background:'pink'
    }

    render() {
        const { style } = this.props;
        //console.log(this.props)
        return (
            <div style={{...this.defultStyle,...style}} >{this.props.children}</div>
        );
    }
}

