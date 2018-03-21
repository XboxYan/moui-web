import React, { PureComponent } from 'react';
import Immutable from 'immutable';
import { FOCUS } from '../util/action';

const initialState = {
    layout:Immutable.fromJS([
        {
            type:'View',
            style:{
                w:1280,
                h:720,
            },
            props:{
                editable:false,
                allowdrop:true,
            },
            datasource:{
                id:2,
                params:[{
                    id:5,
                    name:'params1',
                    value:'3333'
                }]
            },
            child:[]
        }
    ]),
    index:null
};

const StoreContext = React.createContext({
    ...initialState
});

export default class StoreProvider extends PureComponent {
    state = {
        ...initialState
    };
    updata = (layout,index) => {
        if(index){
            this.setState({layout,index});
        }else{
            this.setState({layout});
        }
    }
    focus = (index) => {
        this.setState({index});
    }
    render() {
        const {layout,index} = this.state;
        const current = index?FOCUS(layout,index).toJS():null;
        return (
            <StoreContext.Provider
                value={{
                    layout: layout,
                    updata: this.updata,
                    current:current,
                    index:index,
                    focus:this.focus
                }}
            >
                {this.props.children}
            </StoreContext.Provider>
        )
    }
}

export {StoreContext};