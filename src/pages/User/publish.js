import React, { PureComponent, Fragment } from 'react';
import { List, message, Spin, Button } from 'antd';

export default class Publish extends PureComponent {

    state = {
        Propject: []
    }

    fetchProject = async () => {
        return await fetch(window.SERVER + '/project')
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response;
                }
            })
            .then((data) => {
                if (data.success) {
                    return data.result;
                } else {
                    message.error(data.statusText);
                }
            })
    }

    fetchPage = async (id) => {
        return await fetch(window.SERVER + '/page/' + id)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response;
                }
            })
            .then((data) => {
                if (data.success) {
                    return data.result;
                } else {
                    message.error(data.statusText);
                }
            })
    }

    async componentDidMount() {
        let Propject = await this.fetchProject() || [];
        for (let i = 0; i < Propject.length; i++) {
            Propject[i].pages = await this.fetchPage(Propject[i].id);
        }
        this.setState({ Propject });
    }


    render() {
        const { Propject } = this.state;
        if (Propject.length === 0) {
            return <div className="publish-loader"><Spin tip="正在加载工程" /></div>
        }
        return (
            <div className="publish-con">
                {
                    Propject.map(el => (
                        <List
                            className="publish-list"
                            key={el.id}
                            header={<Fragment><h2>{el.name}</h2><Button>发布</Button></Fragment>}
                            dataSource={el.pages.filter(el=>el.isPage>=0)}
                            renderItem={item => (
                                <List.Item actions={[
                                    <Button>预览</Button>, 
                                    <Button type='primary'>发布</Button>
                                ]}>
                                    <List.Item.Meta
                                        title={item.name}
                                    />
                                </List.Item>
                            )}
                        />
                    ))
                }
            </div>
        );
    }
}