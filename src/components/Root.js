import React, { PureComponent } from 'react';
import Draggble from './Draggble';
import AddStyle from './AddStyle';
import Image from './Image';
import ComProps from './ComProps';
import { StoreContext } from '../store';
import View from './View';
import Text from './Text';

const iiHOC = (WrappedComponent) => class extends WrappedComponent {
    render() {
        if(this.props.store.children&&this.props.store.children.length>0){
            return <WrappedComponent>{super.render()}</WrappedComponent>
        }
        return super.render()
    }
}

@iiHOC
export default class Root extends PureComponent {
    onDrop = (context) => (A, x, y) => {
        const { store, updata } = this.props;
        const M = new ComProps(View, [x, y, 100, 100])
        store.children.push(M);
        console.log(context)
        context.updata(store);
    }

    _render = () => {

    }

    render() {
        const { type: Type, style } = this.props.store;
        //console.log(this.props)
        return (
            <StoreContext.Consumer>
                {
                    context => <Type style={style} onDrop={this.onDrop(context)}></Type>
                }
            </StoreContext.Consumer>
        );
    }
}

