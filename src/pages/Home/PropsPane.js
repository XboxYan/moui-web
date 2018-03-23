import React, { PureComponent } from 'react';
import { Form, Row, Col, Radio, Input, Slider, InputNumber, Checkbox, Button, Select } from 'antd';
import ColorPicker from 'rc-color-picker';
import { CHANGE } from '../../util/action';
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const ButtonGroup = Button.Group;


export default class PropsPane extends PureComponent {
    static defaultProps = {
    }

    onChange = (key_value) => {
        const { layout, updata, index } = this.props.store;
        const _layout = CHANGE(layout, index, key_value, ['style']);
        updata(_layout);
    }

    onSet = (key_value) => {
        const { layout, updata, index } = this.props.store;
        const _layout = CHANGE(layout, index, key_value, ['props']);
        updata(_layout);
    }

    toAlpha = (alpha) => {
        if (alpha === 100) {
            return "";
        }
        let hex = (~~(alpha * 2.25)).toString(16);
        if (hex < 10) {
            hex = "0" + hex;
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
            borderStyle = 'unset',
            borderColor = '#000',
            borderRadius = 0,
            color = '#000',
            fontSize = 14,
            textAlign = 'unset',
            fontWeight = 'unset',
            fontStyle = 'unset',
            textDecoration = 'unset'
        },
        props: {
            editable,
            multiline,
            disabled,
            column,
            row,
            columngap,
            rowgap
        }
     } = this.props.store.current;
        return (
            <div className="pane">
                <Form className="form_pane">
                    <h3 className="divider"><span>位置和大小</span></h3>
                    <Row gutter={10}>
                        <Col span={12}>
                            <FormItem label="X"><InputNumber disabled={!editable} size="small" min={0} value={x} onChange={(value) => this.onChange({ x: value })} /></FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="Y"><InputNumber disabled={!editable} size="small" min={0} value={y} onChange={(value) => this.onChange({ y: value })} /></FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="W"><InputNumber disabled={!editable} size="small" min={0} value={w} onChange={(value) => this.onChange({ w: value })} /></FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="H"><InputNumber disabled={!editable} size="small" min={0} value={h} onChange={(value) => this.onChange({ h: value })} /></FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="锁定"><Checkbox disabled={disabled} checked={!editable} onChange={(e) => this.onSet({ editable: !e.target.checked })} /></FormItem>
                        </Col>
                    </Row>
                </Form>
                <Form className="form_pane">
                    <h3 className="divider"><span>外观</span></h3>
                    <FormItem label="填充">
                        <Button size="small">
                            <ColorPicker
                                className="colorPicker"
                                animation="slide-up"
                                color={backgroundColor}
                                onChange={(colors) => this.onChange({ backgroundColor: colors.color + this.toAlpha(colors.alpha) })}
                            />
                        </Button>
                    </FormItem>
                    <FormItem label="边框">
                        <InputGroup compact className="inputGroup">
                            <Button size="small">
                                <ColorPicker
                                    className="colorPicker"
                                    animation="slide-up"
                                    color={borderColor}
                                    onChange={(colors) => this.onChange({ borderColor: colors.color + this.toAlpha(colors.alpha) })}
                                />
                            </Button>
                            <Select value={borderStyle} size="small" style={{ flex: 1 }} onChange={(value) => this.onChange({ borderStyle: value })}>
                                <Option value="solid">———————</Option>
                                <Option value="dashed">-------</Option>
                                <Option value="dotted">·······</Option>
                            </Select>
                            <InputNumber size="small" style={{ width: 50 }} min={0} value={borderWidth} onChange={(value) => this.onChange({ borderWidth: value })} />
                        </InputGroup>
                    </FormItem>
                    <FormItem label="圆角">
                        <Slider style={{ flex: 1, marginRight: 10 }} value={borderRadius} min={0} max={20} onChange={(value) => this.onChange({ borderRadius: value })} />
                        <InputNumber style={{ width: 50 }} size="small" min={0} max={20} value={borderRadius} onChange={(value) => this.onChange({ borderRadius: value })} />
                    </FormItem>
                    <FormItem label="透明度">
                        <Slider style={{ flex: 1, marginRight: 10 }} value={opacity} min={0} max={1} step={.1} onChange={(value) => this.onChange({ opacity: value })} />
                        <InputNumber style={{ width: 50 }} size="small" min={0} max={1} step={.1} value={opacity} onChange={(value) => this.onChange({ opacity: value })} />
                    </FormItem>
                </Form>
                <Form className="form_pane">
                    <h3 className="divider"><span>文字</span></h3>
                    <Row gutter={10}>
                        <Col span={12}>
                            <FormItem label="颜色">
                                <Button size="small">
                                    <ColorPicker
                                        className="colorPicker"
                                        animation="slide-up"
                                        color={color}
                                        onChange={(colors) => this.onChange({ color: colors.color + this.toAlpha(colors.alpha) })}
                                    />
                                </Button>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="字号"><InputNumber size="small" min={10} value={fontSize} onChange={(value) => this.onChange({ fontSize: value })} /></FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="对齐">
                                <Radio.Group size="small" value={textAlign} className="form-group-row" onChange={(e) => this.onChange({ textAlign: e.target.value })} >
                                    <Radio.Button value="left">居左</Radio.Button>
                                    <Radio.Button value="center">居中</Radio.Button>
                                    <Radio.Button value="right">居右</Radio.Button>
                                </Radio.Group>
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="样式">
                                <ButtonGroup size="small" style={{ flex: .5, marginRight: 10 }} className="form-group-row">
                                    <Button className="font-bold" data-checked={fontWeight !== 'unset'} onClick={() => this.onChange({ fontWeight: fontWeight === 'unset' ? "bold" : "unset" })}>T</Button>
                                    <Button className="font-italic" data-checked={fontStyle !== 'unset'} onClick={() => this.onChange({ fontStyle: fontStyle === 'unset' ? "italic" : "unset" })}>T</Button>
                                </ButtonGroup>
                                <Radio.Group size="small" value={textDecoration} className="form-group-row" onChange={(e) => this.onChange({ textDecoration: e.target.value })} >
                                    <Radio.Button value="unset">T</Radio.Button>
                                    <Radio.Button value="underline" className="text-u">T</Radio.Button>
                                    <Radio.Button value="line-through" className="text-l">T</Radio.Button>
                                    <Radio.Button value="overline" className="text-o">T</Radio.Button>
                                </Radio.Group>
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="换行"><Checkbox checked={multiline} onChange={(e) => this.onSet({ multiline: e.target.checked })} /></FormItem>
                        </Col>
                    </Row>
                </Form>
                <Form className="form_pane">
                    <h3 className="divider"><span>列表和栅格</span></h3>
                    <Row gutter={10}>
                        <Col span={24}>
                            <FormItem label="行数">
                                <Slider style={{ flex: 1, marginRight: 10 }} value={row} min={1} max={10} step={1} onChange={(value) => this.onSet({ row: value })} />
                                <InputNumber style={{ width: 50 }} size="small" min={1} max={10} step={1} value={row} onChange={(value) => this.onSet({ row: value })} />
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="列数">
                                <Slider style={{ flex: 1, marginRight: 10 }} value={column} min={1} max={10} step={1} onChange={(value) => this.onSet({ column: value })} />
                                <InputNumber style={{ width: 50 }} size="small" min={1} max={10} step={1} value={column} onChange={(value) => this.onSet({ column: value })} />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="行间距"><InputNumber size="small" min={0} value={rowgap} onChange={(value) => this.onSet({ rowgap: value })} /></FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="列间距"><InputNumber size="small" min={0} value={columngap} onChange={(value) => this.onSet({ columngap: value })} /></FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}
