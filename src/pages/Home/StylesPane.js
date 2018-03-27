import React, { PureComponent, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { Form, Input, message, Select, Icon, Spin, Tag, Alert } from 'antd';
import { CHANGE } from '../../util/action';
import { request } from '../../util/A7';
const Option = Select.Option;

class PopResult extends PureComponent {

    constructor() {
        super();
        const doc = window.document;
        this.node = doc.createElement('div');
        doc.body.appendChild(this.node);
    }

    renderList = (data) => () => {
        let arr = []
        for (let name in data) {
            arr.push({ name: name, value: data[name] })
        }

    }

    componentWillUnmount() {
        window.document.body.removeChild(this.node);
    }

    onDragStart = (name, value) => (ev) => {
        window.isDragData = true;
        const { clientX, clientY } = ev;
        const { left, top } = ev.target.getBoundingClientRect();
        ev.dataTransfer.setData("source", 'right');
        ev.dataTransfer.setData("name", name);
        ev.dataTransfer.setData("value", value);
        ev.dataTransfer.setData("x", clientX - left);
        ev.dataTransfer.setData("y", clientY - top);
    }

    onDragEnd = () => {
        window.isDragData = false;
    }

    close = () => {
        this.props.closeModel();
    }

    parseData = (data) => {
        if (data) {
            let arr = []
            for (let name in data) {
                arr.push({ name: name, value: data[name] })
            }
            return (
                <ul className="pre-list">
                    {
                        arr.map((d, i) => (
                            <li onDragStart={this.onDragStart(d.name, d.value)} onDragEnd={this.onDragEnd} draggable={true} key={i}>
                                <strong>{d.name + ''}</strong>
                                <span>{d.value + ''}</span>
                            </li>
                        ))
                    }
                </ul>
            );
        } else {
            return <Spin />
        }
    }
    render() {
        const { show, data = null } = this.props;
        return createPortal(
            <div className="my-notification" data-show={show}>
                <a onClick={this.close} className="my-notification-close"><Icon type="close" /></a>
                <h3>参数列表</h3>
                {
                    this.parseData(data)
                }
            </div>,
            this.node
        )
    }
}

class DataParams extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            value: props.data.value,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data.value !== this.props.data.value) {
            this.setState({ value: nextProps.data.value });
        }
    }

    onChange = (e) => {
        this.setState({ value: e.target.value });
    }

    render() {
        const { data, onInput } = this.props
        const { value } = this.state;
        return (
            <div className="data-params">
                <span className="data-params-hd">{data.alias}</span>
                <div className="data-params-bd">
                    <Input addonBefore={data.name} size="small" onBlur={onInput} onChange={this.onChange} value={value} />
                </div>
            </div>
        )
    }
}

export default class StylesPane extends PureComponent {

    state = {
        datasourceList: [],
        fetching: true,
        fetchresult: {},
        show: false
    };

    componentDidMount() {
        this.fetchData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.store.index !== this.props.store.index) {
            this.closeModel();
        }
    }

    fetchData = () => {
        const { fetching } = this.state;
        if (fetching) {
            fetch(window.SERVER+'/datasource/1')
            .then((data)=>data.json())
            .then((data)=>{
                if(data.success){
                    this.setState({ 
                        datasourceList:data.result, 
                        fetching: false 
                    })
                }
            })
        }
    }

    onChange = (value) => {
        const { datasource:{id} } = this.props.store.current;
        if(value===id){
            return false;
        }
        let datasourceItem = this.finddatasourceItem(value);
        const { layout, updata, index } = this.props.store;
        const d = value ? {
            id: value, 
            name:datasourceItem.name, 
            desc:datasourceItem.desc,
            type:datasourceItem.type, 
            url:datasourceItem.url, 
            params:this.filterParams(datasourceItem.params) 
        } : {};
        const _layout = CHANGE(layout, index, {datasource:d}, []);
        updata(_layout);
    }

    parseParams = (params = []) => {
        let s = '';
        if (params.length > 0) {
            let p = '';
            params.forEach((d, i) => {
                p += `${i > 0 ? '&' : ''}${d.name}=${d.value}`
            })
            s = '?' + p;
        }
        return s;
    }

    filterParams = (params) => {
        return params.map(d => ({ name: d.name, id: d.id, alias:d.alias, value:d.defaultVal }))
    }

    finddatasourceItem = (id) => {
        let datasourceItem = {};
        if (id) {
            const { datasourceList } = this.state;
            datasourceItem = datasourceList.find((d) => d.id === id);
        }
        return datasourceItem;
    }

    onInput = (i) => (e) => {
        const { value } = e.target;
        const { layout, updata, index } = this.props.store;
        const _layout = CHANGE(layout, index, { value }, ['datasource','params',i]);
        updata(_layout);
    }

    onPreView = (url,type) => () => {
        request({
            url:url+(type===0?'':'&page=1&pageSize=1'),
            success: (data) => {
                if (data.success) {
                    const result = type === 0 ? data.result:data.result[0]
                    this.setState({
                        show: true,
                        fetchresult: result
                    });
                } else {
                    message.error(data.desc);
                }
            },
        })
    }

    closeModel = () => {
        this.setState({ show: false });
    }

    onCloseTag = () => {
        const { layout, updata, index } = this.props.store;
        const _layout = CHANGE(layout, index, { props: null, value: null }, ['datas']);
        updata(_layout);
    }

    render() {
        const { datasource, datas } = this.props.store.current;
        const { fetching, datasourceList, show, fetchresult } = this.state;
        let id, params,url,type;
        if(datasource){
            id = datasource.id;
            type = datasource.type;
            params = datasource.params;
            url = datasource.url + this.parseParams(params);
        }
        return (
            <div className="pane">
                {
                    !datasource ?
                        (
                            <Form className="form_pane">
                                <h3 className="divider"><span>接收数据</span></h3>
                                {
                                    datas.props
                                        ?
                                        <div className="tagView">
                                            <Tag color="royalblue" closable onClose={this.onCloseTag}>{datas.props}</Tag>
                                            <p>{datas.value}</p>
                                        </div>
                                        :
                                        <Alert message="暂无外部数据" type="info" />
                                }
                            </Form>
                        )
                        :
                        (
                            <Fragment>
                                <Form className="form_pane">
                                    <h3 className="divider"><span>数据接口</span></h3>
                                    <Select
                                        showSearch
                                        placeholder="选择数据来源"
                                        value={fetching ? '加载中...' : id}
                                        optionFilterProp="children"
                                        notFoundContent={fetching ? <Spin size="small" /> : null}
                                        onChange={this.onChange}
                                        allowClear
                                    >
                                        {
                                            datasourceList.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>)
                                        }
                                    </Select>
                                    {
                                        id &&<Alert style={{marginTop:10}} message={datasource.desc||'暂无描述~'} type="info" />
                                    }
                                </Form>
                                {
                                    id && !fetching &&
                                    <Fragment>
                                        <Form className="form_pane">
                                            <h3 className="divider"><span>参数选择</span></h3>
                                            {
                                                params.map((d,i) => <DataParams key={d.id} data={d} onInput={this.onInput(i)} />)
                                            }
                                        </Form>
                                        <Form className="form_pane">
                                            <div className="url-preview">
                                                <h5 onClick={this.onPreView(url,type)}>请求预览</h5>
                                                <span>{url}</span>
                                            </div>
                                        </Form>
                                    </Fragment>
                                }
                            </Fragment>
                        )

                }
                <PopResult show={show} data={fetchresult} closeModel={this.closeModel} />
            </div>
        )
    }
}
