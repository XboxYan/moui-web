import React, { PureComponent } from 'react';
import Immutable from 'immutable';
import { FOCUS } from '../util/action';

//window.SERVER = "http://10.9.212.118:1000";
//window.SERVER = "http://10.9.212.121:3000";
window.SERVER = "";

const initialState = {
    layout: Immutable.fromJS([]),
    index: null,
    indexList:[],
    pageIndex:['1', '1'],
    historyId:null,
    pageList:[]
};

const StoreContext = React.createContext({
    ...initialState
});

export default class StoreProvider extends PureComponent {
    state = {
        ...initialState
    };
    updata = (layout, index, bool=true) => {
        if(layout === this.state.layout){
            return false
        }
        if (index) {
            this.setState({ layout, index,indexList:[index] });
            document.getElementById(index)&&document.getElementById(index).focus();
        } else {
            this.setState({ layout });
        }
        if(bool){
            this.setState({historyId:Date.now()});
        }
    }
    focus = (index,bool) => {
        if(bool){
            const focusindex = index[index.length-1];
            this.setState({ indexList:index,index:focusindex });
            focusindex&&document.getElementById(focusindex).focus();
        }else{
            this.setState({ index });
        }
    }
    jumpPage = (pageIndex) => {
        this.setState({ pageIndex });
    }
    initPage = (pageList) => {
        this.setState({ pageList });
    }
    render() {
        const { layout, index, pageIndex,indexList,historyId,pageList } = this.state;
        const current = index ? (FOCUS(layout, index)? FOCUS(layout, index).toJS() : null) : null;
        return (
            <StoreContext.Provider
                value={{
                    layout: layout,
                    updata: this.updata,
                    current: current,
                    index: index,
                    indexList: indexList,
                    historyId:historyId,
                    focus: this.focus,
                    pageIndex:pageIndex,
                    jumpPage: this.jumpPage,
                    pageList:pageList,
                    initPage: this.initPage,
                }}
            >
                {this.props.children}
            </StoreContext.Provider>
        )
    }
}

export { StoreContext };