import React, { PureComponent, Fragment } from 'react';
import { Form, Input, message, Select, Spin,  Alert } from 'antd';
import { CHANGE } from '../../util/action';
const Option = Select.Option;

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

export default class IndentsPane extends PureComponent {

    state = {
        pages: [],
        fetching: true,
    };

    componentDidMount() {
        this.fetchData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.store.index !== this.props.store.index) {
            //this.closeModel();
        }
    }

    fetchData = () => {
        const { pageIndex } = this.props.store;
        fetch(window.SERVER + '/page/' + pageIndex[1])
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response;
                }
            })
            .then((data) => {
                if (data.success) {
                    this.setState({ pages: data.result,fetching:false })
                } else {
                    message.error(data.statusText);
                }
            })
    }

    onChange = (value) => {
        const { current: { intent: { id } }, pageIndex } = this.props.store;
        if (value === id) {
            return false;
        }
        let pageItem = this.findPage(value);
        const { layout, updata, index } = this.props.store;
        const d = value ? {
            id: value,
            type: pageItem.isPage<0?'url':'page',
            value: pageItem.isPage<0? pageItem.url:(pageIndex[1] + '/' + pageItem.id),
            params: this.filterParams(pageItem.params)
        } : {};
        const _layout = CHANGE(layout, index, { intent: d }, []);
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
        return params.map(d => ({ name: d.name, id: d.id, alias: d.alias, value: d.defaultVal }))
    }

    findPage = (id) => {
        let pageItem = {};
        if (id) {
            const { pages } = this.state;
            pageItem = pages.find((d) => d.id === id);
        }
        return pageItem;
    }

    onInput = (i) => (e) => {
        const { value } = e.target;
        const { layout, updata, index } = this.props.store;
        const _layout = CHANGE(layout, index, { value }, ['intent', 'params', i]);
        updata(_layout);
    }


    render() {
        const { current: { intent }, pageIndex } = this.props.store;
        const { fetching, pages } = this.state;
        if (intent) {
            let { type,value,id,params } = intent
            return (
                <div className="pane">
                        <Form className="form_pane">
                            <h3 className="divider"><span>跳转页面列表</span></h3>
                            <Select
                                showSearch
                                placeholder="选择跳转页面"
                                value={fetching ? '加载中...' : id}
                                optionFilterProp="children"
                                notFoundContent={fetching ? <Spin size="small" /> : null}
                                onChange={this.onChange}
                                allowClear
                            >
                                {
                                    pages.map(d => <Option key={d.id} disabled={pageIndex[0]===d.id.toString()} value={d.id}>{d.name + (pageIndex[0]===d.id.toString()?"(当前页)":"") + (d.isPage<0?"(第三方链接)":"")}</Option>)
                                }
                            </Select>
                            {
                                type === 'url'&&<a href={value} target= "_blank" className="intent-link">{value}</a>
                            }
                        </Form>
                        {
                            id && !fetching &&
                            <Fragment>
                                <Form className="form_pane">
                                    <h3 className="divider"><span>跳转页面参数</span></h3>
                                    {
                                        params.map((d, i) => <DataParams key={d.id} data={d} onInput={this.onInput(i)} />)
                                    }
                                    {
                                        id &&params.length === 0 && <Alert message="跳转该页面不需要参数" type="info" />
                                    }
                                </Form>
                            </Fragment>
                        }
                </div>
            )
        }else{
            return (
                <div className="pane">
                    <Form className="form_pane">
                        <Alert message="该组件无法跳转" type="info" />
                    </Form>
                </div>
            )
        }
    }
}
