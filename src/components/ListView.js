import React, { PureComponent } from 'react';
import EditView from './EditView';

export default class ListView extends PureComponent {

    state = {
        data: [
            {
                name: 'aaa',
                text: '1111'
            },
            {
                name: 'bbb',
                text: '2222'
            },
        ]
    }

    componentDidMount() {
        //const style = {...defaultProps.style,...this.props.style}
        //this.props.onChange && this.props.onChange({...style},['item']);
    }

    render() {
        const {
            props: {
                column,
                gutter
            },
            index
        } = this.props;
        const { data } = this.state;
        return (
            <EditView {...this.props}>
                {
                    data.map((el,i)=>(
                        <div key={index+'~'+i} style={{height:120,position:'relative'}}>
                        {this.props.children}
                        </div>
                    ))
                }
            </EditView>
        );
    }
}
