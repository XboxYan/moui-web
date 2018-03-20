import React, { PureComponent } from 'react';
import EditView from './EditView';

export default class View extends PureComponent {

    render() {
        
        return (
            <EditView {...this.props} >
                {this.props.children}
            </EditView>
        );
    }
}
