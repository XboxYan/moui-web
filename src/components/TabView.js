import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import EditView from './EditView';

export default class TabView extends PureComponent {

    state = {
        tabIndex: 0
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
        const { tabIndex } = this.state;
        this.props.addTab && this.props.addTab(tabIndex);
        this.setState({tabIndex:tabIndex+1})
    }

    delTab = (isLast) => (ev) => {
        ev.stopPropagation();
        const { tabIndex } = this.state;
        this.props.delTab && this.props.delTab(tabIndex);
        if(isLast){
            this.setState({tabIndex:tabIndex-1})
        }
    }

    setTabIndex = (tabIndex) => (ev) => {
        ev.stopPropagation();
        const { dynamic } = this.props.props;
        if (dynamic) {
            return false;
        }
        this.setState({ tabIndex });
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
        } = this.props;
        const style = { ...this.props.style, ...{ flexDirection: this.parseDir(direction) } }
        let [tabs, contents] = this.props.children;
        const tabDirection = this.parseDir(direction).indexOf('row') === 0 ? "column" : "row";
        if (dynamic) {
            tabs = [...tabs, ...tabs];
        }
        const { tabIndex } = this.state;
        return (
            <EditView {...this.props} style={style} className="TabView">
                <div className="view-tabs" data-dynamic={dynamic} style={{ flexDirection: tabDirection, justifyContent: this.parseAlign(tabAlign), margin: -tabGap * .5 }}>
                    {
                        tabs.map((el, i) => {
                            if (el) {
                                return (
                                    <div onClick={this.setTabIndex(i)} key={i} data-index={i === tabIndex?i:''} className="view-tabs-item" style={{ width: tabWidth, height: tabHeight, margin: tabGap * .5 }}>
                                        {el}
                                        {
                                            !dynamic&&(<div className="tab-action" data-show={i === tabIndex}>
                                                <a onClick={this.addTab} className="tab-add"><Icon type="plus-circle" /></a>
                                                {tabs.length>1 && <a onClick={this.delTab(i===tabs.length-1)} className="tab-del"><Icon type="minus-circle" /></a>}
                                            </div>)
                                        }
                                    </div>
                                )
                            }else{
                                return null
                            }
                        })
                    }
                </div>
                <div className="view-contents" data-dynamic={dynamic}>
                    {
                        contents.map((el, i) => {
                            if (el) {
                                return (
                                    <div data-show={i === tabIndex} key={i} data-index={i} className="view-contents-item">{el}</div>
                                )
                            }else{
                                return null
                            }
                        })
                    }
                </div>
            </EditView>
        );
    }
}
