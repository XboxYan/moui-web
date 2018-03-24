import React, { PureComponent,Fragment } from 'react';
import { Button } from 'antd';
import EditView from './EditView';

export default class TabView extends PureComponent {

    state = {
        tabIndex:0
    }

    parseDir = (direction) => {
        let dir = "";
        switch (direction) {
            case 'top':
                dir = "column";
                break;
            case 'right':
                dir = "row-reverse";
                break;
            case 'bottom':
                dir = "column-reverse";
                break;
            case 'left':
                dir = "row";
                break;
            default:
                break;
        }
        return dir;
    }

    parseAlign = (tabAlign) => {
        let align = "";
        switch (tabAlign) {
            case 'start':
            align = "flex-start";
                break;
            case 'center':
            align = "center";
                break;
            case 'end':
            align = "flex-end";
                break;
            default:
                break;
        }
        return align;
    }

    addTab = (ev) => {
        ev.stopPropagation();
        this.props.addTab&&this.props.addTab();
    }

    setTabIndex = (tabIndex) => (ev) => {
        ev.stopPropagation();
        const {dynamic} = this.props.props;
        if(dynamic){
            return false;
        }
        this.setState({tabIndex});
    }

    render() {
        const {
            props: {
                direction,
                tabWidth,
                tabHeight,
                tabGap,
                tabAlign,
                dynamic
            },
            index
        } = this.props;
        const style = {...this.props.style,...{ flexDirection:this.parseDir(direction)}}
        let [tabs,contents] = this.props.children;
        const tabDirection = this.parseDir(direction).indexOf('row')===0?"column":"row";
        if(dynamic){
            tabs = [...tabs,...tabs];
        }
        const {tabIndex} = this.state;
        return (
            <EditView {...this.props} style={style} className="TabView">
                <div className="view-tabs" data-dynamic={dynamic} style={{ flexDirection:tabDirection, justifyContent:this.parseAlign(tabAlign), margin:-tabGap*.5}}>
                    {
                        tabs.map((el,i)=><div onClick={this.setTabIndex(i)} key={i} className="view-tabs-item" style={{width:tabWidth,height:tabHeight,margin:tabGap*.5}}>{el}</div>)
                    }
                </div>
                <div className="view-contents">
                    {
                        contents.map((el,i)=><div data-show={i===tabIndex} key={i} className="view-contents-item">{el}</div>)
                    }
                </div>
                {
                    !dynamic&&<Button className="tab-add" onClick={this.addTab}>新增一个标签</Button>
                }
            </EditView>
        );
    }
}
