import React, { PureComponent, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { Form, Input, message, Checkbox, Select, Icon, Spin, Tag, Alert } from 'antd';
import Immutable from 'immutable';
import { CHANGE } from '../../util/action';
import { request } from '../../util/A7';
const Option = Select.Option;

const datasourceList = [
    {
        "id": 1,
        "name": "获取推荐列表",
        "desc": "获取推荐列表(A7)",
        "url": "A7://10.9.216.15:8080/getRelateList",
        "createdAt": "2018-03-07T07:20:20.640Z",
        "updatedAt": "2018-03-07T07:20:20.640Z",
        "projectId": 1,
        "params": [
            {
                "id": 1,
                "name": "assetId",
                "value": "assetId",
                "createdAt": "2018-03-07T08:38:55.282Z",
                "updatedAt": "2018-03-07T08:38:55.282Z",
                "dataSourceId": 2
            },
            {
                "id": 2,
                "name": "当前页",
                "value": "page",
                "createdAt": "2018-03-07T08:38:55.282Z",
                "updatedAt": "2018-03-07T08:38:55.282Z",
                "dataSourceId": 2
            },
            {
                "id": 3,
                "name": "总页数",
                "value": "pageSize",
                "createdAt": "2018-03-07T08:38:55.282Z",
                "updatedAt": "2018-03-07T08:38:55.282Z",
                "dataSourceId": 2
            }
        ]
    },
    {
        "id": 2,
        "name": "获取推荐列表22",
        "desc": "desc获取推荐列表22",
        "url": "http://1.2.3.4/getRecommend22",
        "createdAt": "2018-03-07T07:20:20.640Z",
        "updatedAt": "2018-03-07T07:20:20.640Z",
        "projectId": 1,
        "params": [
            {
                "id": 5,
                "name": "参数1",
                "value": "params1",
                "createdAt": "2018-03-07T08:38:55.282Z",
                "updatedAt": "2018-03-07T08:38:55.282Z",
                "dataSourceId": 2
            },
            {
                "id": 6,
                "name": "参数2",
                "value": "params2",
                "createdAt": "2018-03-07T08:38:55.282Z",
                "updatedAt": "2018-03-07T08:38:55.282Z",
                "dataSourceId": 2
            }
        ]
    }
]


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
            value: props.params.value,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.value !== this.props.params.value) {
            this.setState({ value: nextProps.params.value });
        }
    }

    onChange = (e) => {
        this.setState({ value: e.target.value });
    }

    render() {
        const { data, params, onChange, onInput } = this.props
        const { value } = this.state;
        return (
            <div className="data-params">
                <span className="data-params-hd">{data.name}</span>
                <div className="data-params-bd">
                    <Input addonBefore={data.value} size="small" onBlur={onInput} onChange={this.onChange} disabled={!params.id} value={value} />
                    <Checkbox onChange={onChange} checked={!!params.id} />
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
            setTimeout(() => {
                this.setState({ datasourceList, fetching: false })
            }, 1000);
        }
    }

    onChange = (value) => {
        let params = [];
        if (value) {
            params = this.filterParams(this.datasourceItem(value).params);
        }
        const { layout, updata, index } = this.props.store;
        const d = { id: value || '', params };
        const _layout = CHANGE(layout, index, d, ['datasource']);
        this.setState({ datasource: d });
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
        return params.map(d => ({ name: d.value, id: d.id, value: '' }))
    }

    datasourceItem = (id) => {
        let datasourceItem = {};
        if (id) {
            const { datasourceList } = this.state;
            datasourceItem = datasourceList.filter((d) => d.id === id)[0];
        }
        return datasourceItem;
    }

    onSelect = (d) => (e) => {
        const { checked } = e.target;
        const o = Immutable.fromJS(this.props.store.current.datasource);
        const { layout, updata, index } = this.props.store;
        if (!checked) {
            const i = o.get('params').findIndex(m => m.get('id') === d.id);
            const datasource = o.removeIn(['params', i]);
            const _layout = CHANGE(layout, index, { ...datasource.toJS() }, ['datasource']);
            updata(_layout);
        } else {
            const $item = Immutable.fromJS({ id: d.id, name: d.value, value: '' });
            const datasource = o.updateIn(['params'], value => value.push($item));
            const _layout = CHANGE(layout, index, { ...datasource.toJS() }, ['datasource']);
            updata(_layout);
        }
    }

    onInput = (d) => (e) => {
        const { value } = e.target;
        const o = Immutable.fromJS(this.props.store.current.datasource);
        const i = o.get('params').findIndex(m => m.get('id') === d.id);
        const datasource = o.setIn(['params', i, 'value'], value);
        const { layout, updata, index } = this.props.store;
        const _layout = CHANGE(layout, index, { ...datasource.toJS() }, ['datasource']);
        updata(_layout);
    }

    include = (data, params) => {
        return params.find((d) => d.id === data.id) || {};
    }

    onPreView = (url) => () => {
        request({
            url,
            success: (data) => {
                if (data.success) {
                    this.setState({
                        show: true,
                        fetchresult: data.result[0]
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
        let id, params,datasourceItem,url;
        if(datasource){
            id = datasource.id;
            params = datasource.params;
            datasourceItem = this.datasourceItem(id) || {};
            url = datasourceItem.url + this.parseParams(params);
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
                                        value={fetching ? '加载中...' : datasourceItem.name}
                                        optionFilterProp="children"
                                        notFoundContent={fetching ? <Spin size="small" /> : null}
                                        onChange={this.onChange}
                                        allowClear
                                    >
                                        {
                                            datasourceList.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>)
                                        }
                                    </Select>
                                </Form>
                                {
                                    id && !fetching &&
                                    <Fragment>
                                        <Form className="form_pane">
                                            <h3 className="divider"><span>参数选择</span></h3>
                                            {
                                                datasourceItem.params.map(d => <DataParams params={this.include(d, params)} key={d.id} data={d} onChange={this.onSelect(d)} onInput={this.onInput(d)} />)
                                            }
                                        </Form>
                                        <Form className="form_pane">
                                            <div className="url-preview">
                                                <h5 onClick={this.onPreView(url)}>请求预览</h5>
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
