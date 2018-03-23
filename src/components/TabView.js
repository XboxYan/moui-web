import React, { PureComponent,Fragment } from 'react';
import EditView from './EditView';

export default class TabView extends PureComponent {

    render() {
        const {
            props: {
                direction,
            },
            index
        } = this.props;
        const child = this.props.children;
        //const list = Array.from({length:column*row}, (v,k) => k);
        return (
            <EditView {...this.props} className="TabView">
                <div className="view-tabs">{child[0]}</div>
                <div className="view-contents">{child[1]}</div>
            </EditView>
        );
    }
}
