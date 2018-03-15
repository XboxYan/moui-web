import React, { PureComponent } from 'react';
import Draggble from './Draggble';
import AddStyle from './AddStyle';
import Image from './Image';
import ComProps from './ComProps';
import { StoreContext } from '../store';
import View from './View';
import Text from './Text';

export default class Root extends PureComponent {
    onDrop = (context) => (A, x, y) => {
        const { store, updata } = this.props;
        const M = new ComProps(View, [x, y, 100, 100])
        store.children.push(M);
        console.log(context)
        //context.updata(store);
    }

    _render = () => {

    }

    render() {
        const { type: Type, style } = this.props.store;
        console.log(this.props)
        return (
            <StoreContext.Consumer>
                {
                    context => <Type style={style} onDrop={this.onDrop(context)}>
                    {
                        this.props.store.children.map((el,i)=><Root key={i} store={el.children} />)
                    }   
                    </Type>
                }
            </StoreContext.Consumer>
        );
    }
}

