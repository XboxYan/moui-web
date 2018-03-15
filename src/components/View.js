import React, { PureComponent } from 'react';
import EditView from './EditView';

const defaultProps = {
    w:100,
    h:100
}

export default class View extends PureComponent {
    static defaultProps = {
        ...defaultProps
    }
    constructor(props) {
        super(props);
        this.state = {
            style: props.style
        };
    }
    onFocus = () => {
        this.props.onFocus && this.props.onFocus(this);
    }
    render() {
        const style = {...defaultProps,...this.props.style}
        console.log(style)
        return (
            <EditView {...this.props} style={style} onFocus={this.onFocus}>
                {this.props.children}
            </EditView>
        );
    }
}
