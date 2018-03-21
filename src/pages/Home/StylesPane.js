import React, { PureComponent, Fragment } from 'react';
import { Form, Row, Col, Radio, Input, Slider, InputNumber, Checkbox, Button, Select, Spin } from 'antd';
import Immutable from 'immutable';
import { CHANGE } from '../../util/action';
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const ButtonGroup = Button.Group;

const datasourceList = [
    {
        "id": 1,
        "name": "获取推荐列表11",
        "desc": "desc获取推荐列表11",
        "url": "http://1.2.3.4/getRecommend11",
        "createdAt": "2018-03-07T07:20:20.640Z",
        "updatedAt": "2018-03-07T07:20:20.640Z",
        "projectId": 1,
        "params": [
            {
                "id": 5,
                "name": "分页1",
                "value": "page1",
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
        const {value} = this.state;
        return (
            <FormItem className="data-params" label={data.name}>
                <Input addonBefore={data.value} size="small" onBlur={onInput} onChange={this.onChange} disabled={!params.id} value={value} />
                <Checkbox onChange={onChange} checked={!!params.id} />
            </FormItem>
        )
    }
}

export default class StylesPane extends PureComponent {

    state = {
        datasourceList: [],
        fetching: true,
    };

    componentDidMount() {
        this.fetchData()
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

    render() {
        const { fetching, datasourceList } = this.state;
        const { datasource } = this.props.store.current;
        if (!datasource) {
            return (
                <div className="pane">
                    <Form className="form_pane">
                        <h3 className="divider"><span>接收数据</span></h3>
                    </Form>
                </div>
            )
        }
        const { id, params } = datasource;
        const datasourceItem = this.datasourceItem(id) || {};
        return (
            <div className="pane">
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
                                <h5>请求地址预览</h5>
                                <span>{datasourceItem.url + this.parseParams(params)}</span>
                            </div>
                        </Form>
                        <Form className="form_pane">
                            <Button>请求</Button>
                        </Form>
                    </Fragment>
                }
            </div>
        );
    }
}
