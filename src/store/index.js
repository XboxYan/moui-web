import React, { PureComponent } from 'react';
import Immutable from 'immutable';
import {FOCUS} from '../util/action';

const initialState = {
    color: "blue",
    //layout: new ComProps(View,[0,0,600,400])
    //layout[0].child[0].child[0]
    layout:Immutable.fromJS([
        {
            type:'View',
            id:'0',
            style:{
                w:1280,
                h:720,
                background:'pink'
            },
            props:{
                //editable:false
            },
            child:[
                {
                    type:'View',
                    id:'0-0',
                    style:{
                        w:200,
                        h:200
                    },
                    child:[
                        {
                            type:'Image',
                            id:'0-0-0',
                            style:{
                                x:20,
                                y:20
                            },
                            props:{}
                        }
                    ]
                },
                {
                    type:'Image',
                    id:'0-1',
                    style:{
                        w:150,
                        x:200,
                        y:200
                    },
                    props:{
                        src:'http://img.kuqin.com/upimg/allimg/160526/210301J61-1.png'
                    }
                },
                {
                    type:'Text',
                    id:'0-2',
                    style:{
                        x:50,
                        y:150
                    },
                    props:{
                        text:'和经济环境开会就开会就看很近很近',
                    }
                },
                {
                    type:'Text',
                    id:'0-3',
                    style:{
                        x:50,
                        y:200
                    },
                    props:{
                        multiline:false,
                    }
                }
            ]
        }
    ]),
    current:null
};

const StoreContext = React.createContext({
    ...initialState
});

export default class StoreProvider extends PureComponent {
    state = {
        ...initialState
    };
    updata = (layout) => {
        this.setState({layout})
    }
    focus = (index) => {
        const {layout} = this.state;
        this.setState({current:FOCUS(layout,index).toJS()});
    }
    render() {
        const {color,layout,current} = this.state;
        return (
            <StoreContext.Provider
                value={{
                    layout: layout,
                    color: color,
                    updata: this.updata,
                    current:current,
                    focus:this.focus
                }}
            >
                {this.props.children}
            </StoreContext.Provider>
        )
    }
}

export {StoreContext};