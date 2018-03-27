import React, { PureComponent } from 'react';
import Immutable from 'immutable';
import { FOCUS } from '../util/action';

window.SERVER = "http://localhost:3000";

const initialState = {
    layout: Immutable.fromJS([
        {
            type: 'View',
            style: {
                w: 1280,
                h: 720,
            },
            props: {
                editable: false,
                allowdrop: true,
                disabled: true
            },
            datasource: {
                "id": 1,
                "name": "栏目列表",
                "desc": "根据父栏目获取子栏目列表",
                "url": "A7://10.9.216.15:8080/getColumns",
                "type": 1,
                "params": [
                    {
                        "id": 4,
                        "alias": "父栏目id",
                        "name": "columnId",
                        "value": "MANU6500842333",
                    }
                ]
            },
            child: []
        }
    ]),
    index: null
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
    render() {
        const { layout, index } = this.state;
        const current = index ? FOCUS(layout, index).toJS() : null;
        return (
            <StoreContext.Provider
                value={{
                    layout: layout,
                    updata: this.updata,
                    current: current,
                    index: index,
                    focus: this.focus
                }}
            >
                {this.props.children}
            </StoreContext.Provider>
        )
    }
}

export { StoreContext };