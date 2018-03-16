import React, { PureComponent } from 'react';
import EditView from './EditView';

const defaultProps = {
    style:{
        w:100,
        h:100
    }
}

export default class View extends PureComponent {
    static defaultProps = {
        ...defaultProps
    }

    render() {
        const style = {...defaultProps.style,...this.props.style}
        return (
            <EditView {...this.props} style={style} >
                {this.props.children}
            </EditView>
        );
    }
}
