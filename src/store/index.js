import React, { PureComponent } from 'react';
import Immutable from 'immutable';
import { FOCUS } from '../util/action';

window.SERVER = "";

const initialState = {
    layout: Immutable.fromJS([]),
    index: null,
    pageIndex:['1', '1']
};

const StoreContext = React.createContext({
    ...initialState
});

export default class StoreProvider extends PureComponent {
    state = {
        ...initialState
    };
    updata = (layout, index) => {
        if (index) {
            this.setState({ layout, index });
        } else {
            this.setState({ layout });
        }
    }
    focus = (index) => {
        this.setState({ index });
    }
    jumpPage = (pageIndex) => {
        this.setState({ pageIndex });
    }
    render() {
        const { layout, index, pageIndex } = this.state;
        const current = index ? FOCUS(layout, index).toJS() : null;
        return (
            <StoreContext.Provider
                value={{
                    layout: layout,
                    updata: this.updata,
                    current: current,
                    index: index,
                    focus: this.focus,
                    pageIndex:pageIndex,
                    jumpPage: this.jumpPage,
                }}
            >
                {this.props.children}
            </StoreContext.Provider>
        )
    }
}

export { StoreContext };