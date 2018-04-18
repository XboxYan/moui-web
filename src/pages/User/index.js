import React, { PureComponent } from 'react';
import MD5 from '../../util/md5-min';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        const { form, login } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                this.login(values, (type) => {
                    login(true,type);
                    if (values.remember) {
                        window.localStorage.setItem('userName', values.userName);
                    } else {
                        window.localStorage.removeItem('userName');
                    }
                })
            } else {
                message.error('请完善登录信息!');
            }
        });
    }
    login = (values, cb) => {
        const data = {
            username: values.userName,
            password: MD5(values.password)
        }
        fetch(window.SERVER + '/user/login', {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response;
                }
            })
            .then((data) => {
                if (data.success) {
                    const {type} = data.result;
                    let usertype = '';
                    if(type === 0 ){
                        usertype = '发布者';
                    }else{
                        usertype = '编辑者';
                    }
                    message.success(`${usertype}${values.userName}登录成功`);
                    if (typeof cb === 'function') {
                        cb(type);
                    }
                } else {
                    message.error(data.desc);
                }
            })
    }
    componentDidMount() {
        this.props.form.setFieldsValue({ userName: window.localStorage.getItem('userName') || '' })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <h2 className="logo" style={{ color: 'royalblue' }}><Icon type="cloud" /> Coship</h2>
                <FormItem>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: '请输入用户名!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                        )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                        )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(
                        <Checkbox>记住账号</Checkbox>
                        )}
                    <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
                </FormItem>
            </Form>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);


class Index extends PureComponent {
    render() {
        return (
            <div className="login-con"><WrappedNormalLoginForm login={this.props.login} /></div>
        );
    }
}

export default Index;