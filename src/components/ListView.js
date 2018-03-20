import React, { PureComponent } from 'react';
import { List } from 'antd';
import EditView from './EditView';
import Image from './Image';
import View from './View';
import Text from './Text';

const type = {
    'View': View,
    'Text': Text,
    'Image': Image,
    'ListView': ListView,
}

const defaultProps = {
    style: {
        w: 300,
        h: 300
    },
    props: {
        column: 1,
        gutter: 10
    },
    datasource: {

    },
    item: [{
        type: 'View',
        id: '0',
        style: {
            h: 100,
        },
        props: {
            editable: false
        },
        child: [
            {
                type: 'Text',
                style: {
                    x: 0,
                    y: 0
                },
                props: {
                    //text:'和经济环境开会就开会就看很近很近',
                },
                "datas": {
                    "prop": "name"
                }
            },
            {
                type: 'Text',
                style: {
                    x: 0,
                    y: 20
                },
                props: {
                    //text:'和经济环境开会就开会就看很近很近',
                },
                "datas": {
                    "prop": "text"
                }
            },
        ]
    }]
}

class ComItem extends PureComponent {
    loop = (data, m) => data.map((item, i) => {
        if (!item) {
            return null
        }
        const Tag = type[item.type];
        const key = m + '-' + i;
        let child = null;
        if (item.child && item.child.length) {
            child = this.loop(item.child, key)
        }
        const index = key;
        return (
            <Tag
                
                key={index}
                style={item.style}
                props={item.props}>
                {child}
            </Tag>
        )
    });
    render() {
        const { view,item,index } = this.props;
        console.log(view)
        return this.loop(view,index);
    }
}

export default class ListView extends PureComponent {
    static defaultProps = {
        ...defaultProps
    }

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
            item,
            index
        } = this.props;
        const { data } = this.state;
        return (
            <EditView {...this.props}>
                {
                    data.map((el,i)=>(
                        <div key={index+i} style={{height:120,position:'relative'}}>
                        {this.props.children}
                        </div>
                    ))
                }
            </EditView>
        );
    }
}
