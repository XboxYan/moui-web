import React, { PureComponent } from 'react';
import { Form, Row, Col, Input,Slider, InputNumber, Checkbox, Button, Icon, Select } from 'antd';
import ColorPicker from 'rc-color-picker';
import { CHANGE } from '../../util/action';
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;


export default class PropsPane extends PureComponent {
    static defaultProps = {
    }

    onChange = (key_value) => {
        console.log(key_value);
        const { layout, updata, index } = this.props.store;
        const _layout = CHANGE(layout, index, key_value, ['style']);
        updata(_layout);
    }

    toAlpha = (alpha) => {
        if(alpha===100){
            return "";
        }
        let hex = (~~(alpha*2.25)).toString(16);
        if(hex<10){
            hex = "0"+hex;
        }
        return hex;
    }

    render() {
        const { style: {
            x = 0,
            y = 0,
            w,
            h,
            backgroundColor = '#fff',
            opacity = 1,
            borderWidth = 0,
            borderStyle = 'solid',
            borderColor = '#000'
        }, type } = this.props.store.current;
        return (
            <div className="pane">
                <Form className="form_pane">
                    <h3 className="divider"><span>位置和大小</span></h3>
                    <Row gutter={10}>
                        <Col span={12}>
                            <FormItem label="X"><InputNumber size="small" min={0} value={x} onChange={(value) => this.onChange({ x: value })} /></FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="Y"><InputNumber size="small" min={0} value={y} onChange={(value) => this.onChange({ y: value })} /></FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="W"><InputNumber size="small" min={0} value={w} onChange={(value) => this.onChange({ w: value })} /></FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="H"><InputNumber size="small" min={0} value={h} onChange={(value) => this.onChange({ h: value })} /></FormItem>
                        </Col>
                    </Row>
                </Form>
                <Form className="form_pane">
                    <h3 className="divider"><span>外观</span></h3>
                    <FormItem label="填充">
                        <div className="form_pane_row">
                            <ColorPicker
                                className="colorPicker"
                                animation="slide-up"
                                //enableAlpha={false}
                                color={backgroundColor}
                                onChange={(colors) => this.onChange({ backgroundColor: colors.color + this.toAlpha(colors.alpha) })}
                            />
                            <Checkbox />
                        </div>
                    </FormItem>
                    <FormItem label="边框">
                        <div className="form_pane_row">
                            <ColorPicker
                                className="colorPicker"
                                animation="slide-up"
                                //enableAlpha={false}
                                color={borderColor}
                                onChange={(colors) => this.onChange({ borderColor: colors.color + this.toAlpha(colors.alpha) })}
                            />
                            <InputGroup compact className="inputGroup">
                                <Select value={borderStyle} size="small"  onChange={(value) => this.onChange({ borderStyle: value })}>
                                    <Option value="solid">———————</Option>
                                    <Option value="dashed">-------</Option>
                                    <Option value="dotted">·······</Option>
                                </Select>
                                <InputNumber size="small" min={0} value={borderWidth} onChange={(value) => this.onChange({ borderWidth: value })} />
                            </InputGroup>
                        </div>
                    </FormItem>
                    <FormItem label="透明度">
                        <div className="form_pane_row">
                            <Slider style={{flex:2,marginRight:10}} value={opacity} min={0} max={1} step={.1}  onChange={(value) => this.onChange({ opacity: value })} />
                            <InputNumber style={{flex:1}} size="small" min={0} max={1} step={.1} value={opacity}  onChange={(value) => this.onChange({ opacity: value })} />
                        </div>
                    </FormItem>
                </Form>
            </div>
        );
    }
}
