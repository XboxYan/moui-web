import React, { PureComponent } from 'react';

const initialState = {
    color: "blue",
    layout:[
        {
            type:'View',
            id:'0',
            style:{
                width:'100%',
                height:'100%'
            },
            props:{
                //editable:false
            },
            child:[
                // {
                //     type:'View',
                //     id:'0-0',
                //     style:{
                //         w:200,
                //         h:200
                //     },
                //     child:[
                //         {
                //             type:'Image',
                //             id:'0-0-0',
                //             style:{
                //                 x:20,
                //                 y:20
                //             }
                //         }
                //     ]
                // },
                // {
                //     type:'Image',
                //     id:'0-1',
                //     style:{
                //         w:150,
                //         x:200,
                //         y:200
                //     },
                //     props:{
                //         src:'http://img.kuqin.com/upimg/allimg/160526/210301J61-1.png'
                //     }
                // },
                // {
                //     type:'Text',
                //     id:'0-2',
                //     style:{
                //         x:50,
                //         y:150
                //     },
                //     props:{
                //         text:'和经济环境开会就开会就看很近很近',
                //     }
                // },
                {
                    type:'Text',
                    id:'0-3',
                    style:{
                        x:50,
                        y:200
                    },
                    props:{
                        //multiline:false,
                    }
                }
            ]
        }
    ]
};

const StoreContext = React.createContext({
    ...initialState
});

export default class StoreProvider extends PureComponent {
    state = {
        ...initialState
    };
    handleContextChange = () => {
        this.setState({color:this.state.color==='blue'?'red':'blue'})
    }
    render() {
        const {color,layout} = this.state;
        return (
            <StoreContext.Provider
                value={{
                    layout: layout,
                    color: color,
                    dispatch: this.handleContextChange
                }}
            >
                {this.props.children}
            </StoreContext.Provider>
        )
    }
}

export {StoreContext};