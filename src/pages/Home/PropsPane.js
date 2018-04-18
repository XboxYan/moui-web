import React, { PureComponent,Fragment } from 'react';
import { Form, Row, Col, Radio, Slider, InputNumber, Checkbox, Button, message, Alert } from 'antd';
import ColorPicker from 'rc-color-picker';
import { CHANGE } from '../../util/action';
const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const RadioGroup = Radio.Group;


export default class PropsPane extends PureComponent {

    imgUpload = (set) => (ev) => {
        //this.setState({ isUpload: true })
        const { pageIndex } = this.props.store;
        const files = ev.target.files;
        if (files.length > 0) {
            let data = new FormData();
            data.append('img', files[0]);
            fetch(window.SERVER + '/image/' + pageIndex[0], {
                method: 'POST',
                body: data
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        return res
                    }
                })
                .then((res) => {
                    if (res.success) {
                        const src = res.result.savePath + '/img/' + res.result.saveName;
                        this[set]({ backgroundImage: src });
                        message.success('图片上传成功~');
                    } else {
                        message.error('图片上传失败！' + res.statusText);
                    }
                    //this.setState({ isUpload: false })
                })
        }
    }

    onChange = (key_value) => {
        const { layout, updata, indexList } = this.props.store;
        let _layout = layout;
        indexList.forEach(item=>{
            _layout = CHANGE(_layout, item, key_value, ['style']);
        })
        updata(_layout);
    }

    onSet = (key_value) => {
        const { layout, updata, indexList } = this.props.store;
        let _layout = layout;
        indexList.forEach(item=>{
            _layout = CHANGE(_layout, item, key_value, ['props']);
        })
        updata(_layout);
    }

    onFocus = (key_value) => {
        const { layout, updata, indexList } = this.props.store;
        let _layout = layout;
        indexList.forEach(item=>{
            _layout = CHANGE(_layout, item, key_value, ['focus']);
        })
        updata(_layout);
    }

    onSelected = (key_value) => {
        const { layout, updata, indexList } = this.props.store;
        let _layout = layout;
        indexList.forEach(item=>{
            _layout = CHANGE(_layout, item, key_value, ['select']);
        })
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

    colorName = (color) => {
        let className = "";
        if (color === 'unset') {
            className += " color-none";
        }
        return className;
    }

    render() {
        const { current, indexList } = this.props.store;
        const { style: {
            x = 0,
            y = 0,
            w,
            h,
            backgroundColor = 'unset',
            backgroundImage = 'unset',
            opacity = 1,
            outlineWidth = 0,
            outlineColor = 'unset',
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
                columnGap,
                rowGap,
                direction,
                tabWidth,
                tabHeight,
                tabGap,
                tabAlign,
                dynamic
        },
            focus,
            select,
            type
     } = current;
        const {
        enable = false,
            onview = true,
            outlineWidth: _outlineWidth = outlineWidth,
            outlineColor: _outlineColor = outlineColor,
            borderRadius: _borderRadius = borderRadius,
            disabled:_disabled=false,
            color: _color = color,
            backgroundColor: _backgroundColor = backgroundColor,
            backgroundImage: _backgroundImage = backgroundImage,

     } = focus || {};
        const {
            enable:$enable = false,
            onview:$onview = true,
            outlineWidth: $outlineWidth = outlineWidth,
            outlineColor: $outlineColor = outlineColor,
            borderRadius: $borderRadius = borderRadius,
            color: $color = color,
            disabled:$disabled=false,
            backgroundColor: $backgroundColor = backgroundColor,
            backgroundImage: $backgroundImage = backgroundImage,

     } = select || {};
        const multiple = indexList.length > 1;
        return (
            <div className="pane">
                {
                    multiple && <Alert style={{ marginBottom: 10 }} message="现在是多选模式" type="warning" />
                }
                {
                    !multiple &&
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
                }
                {
                    type !== 'Text' &&
                    <Form className="form_pane">
                        <h3 className="divider"><span>外观</span></h3>
                        {
                            type !== 'Image' &&
                            <FormItem label="背景">
                                <Button size="small">
                                    <ColorPicker
                                        className={"colorPicker" + this.colorName(backgroundColor)}
                                        animation="slide-up"
                                        color={backgroundColor}
                                        onChange={(colors) => this.onChange({ backgroundColor: colors.color + this.toAlpha(colors.alpha) })}
                                    />
                                </Button>
                                <Button className={"img-load-btn" + this.colorName(backgroundImage)} size="small" style={{ marginLeft: 10 }}>
                                    <input onChange={this.imgUpload("onChange")} type="file" accept="image/*" id={"xFile-img"} />
                                    <label htmlFor={"xFile-img"} style={{ backgroundImage: backgroundImage === 'unset' ? 'none' : `url(${backgroundImage})` }} />
                                </Button>
                                <a className="color-reset-btn" onClick={() => this.onChange({ backgroundColor: 'unset', backgroundImage: 'unset' })}>清除</a>
                            </FormItem>
                        }
                        <FormItem label="边框">
                            <Button size="small" style={{ marginRight: 10 }}>
                                <ColorPicker
                                    className="colorPicker"
                                    animation="slide-up"
                                    color={outlineColor}
                                    onChange={(colors) => this.onChange({ outlineColor: colors.color + this.toAlpha(colors.alpha) })}
                                />
                            </Button>
                            <Slider value={outlineWidth} min={0} max={20} step={2} onChange={(value) => this.onChange({ outlineWidth: value })} />
                            <InputNumber style={{ width: 50 }} size="small" min={0} max={20} value={outlineWidth} onChange={(value) => this.onChange({ outlineWidth: value })} />
                        </FormItem>
                        <FormItem label="圆角">
                            <Slider value={borderRadius} min={0} max={20} onChange={(value) => this.onChange({ borderRadius: value })} />
                            <InputNumber style={{ width: 50 }} size="small" min={0} max={20} value={borderRadius} onChange={(value) => this.onChange({ borderRadius: value })} />
                        </FormItem>
                        <FormItem label="透明度">
                            <Slider value={opacity} min={0} max={1} step={.1} onChange={(value) => this.onChange({ opacity: value })} />
                            <InputNumber style={{ width: 50 }} size="small" min={0} max={1} step={.1} value={opacity} onChange={(value) => this.onChange({ opacity: value })} />
                        </FormItem>
                    </Form>
                }
                {
                    type === 'Text' &&
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
                }
                {
                    type === "ListView"
                    &&
                    <Form className="form_pane">
                        <h3 className="divider"><span>列表和栅格</span></h3>
                        <Row gutter={10}>
                            <Col span={24}>
                                <FormItem label="行数">
                                    <Slider value={row} min={1} max={10} step={1} onChange={(value) => this.onSet({ row: value })} />
                                    <InputNumber style={{ width: 50 }} size="small" min={1} max={10} step={1} value={row} onChange={(value) => this.onSet({ row: value })} />
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="列数">
                                    <Slider value={column} min={1} max={10} step={1} onChange={(value) => this.onSet({ column: value })} />
                                    <InputNumber style={{ width: 50 }} size="small" min={1} max={10} step={1} value={column} onChange={(value) => this.onSet({ column: value })} />
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="行间距"><InputNumber size="small" min={0} value={rowGap} onChange={(value) => this.onSet({ rowGap: value })} /></FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="列间距"><InputNumber size="small" min={0} value={columnGap} onChange={(value) => this.onSet({ columnGap: value })} /></FormItem>
                            </Col>
                        </Row>
                    </Form>
                }
                {
                    type === "TabView"
                    &&
                    <Form className="form_pane">
                        <h3 className="divider"><span>标签({dynamic ? "动" : "静"}态)</span></h3>
                        <Row gutter={10}>
                            <Col span={24}>
                                <FormItem label="位置">
                                    <RadioGroup className="radiogroup-small" onChange={(e) => this.onSet({ direction: e.target.value })} value={direction}>
                                        <Radio value="top">上</Radio>
                                        <Radio value="right">右</Radio>
                                        <Radio value="bottom">下</Radio>
                                        <Radio value="left">左</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="标签W"><InputNumber size="small" min={0} value={tabWidth} onChange={(value) => this.onSet({ tabWidth: value })} /></FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="标签H"><InputNumber size="small" min={0} value={tabHeight} onChange={(value) => this.onSet({ tabHeight: value })} /></FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="标签间距">
                                    <Slider value={tabGap} min={0} max={50} step={5} onChange={(value) => this.onSet({ tabGap: value })} />
                                    <InputNumber style={{ width: 50 }} size="small" min={0} value={tabGap} onChange={(value) => this.onSet({ tabGap: value })} />
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="对齐">
                                    <Radio.Group size="small" value={tabAlign} className="form-group-row" onChange={(e) => this.onSet({ tabAlign: e.target.value })} >
                                        <Radio.Button value="start">起始</Radio.Button>
                                        <Radio.Button value="center">居中</Radio.Button>
                                        <Radio.Button value="end">结束</Radio.Button>
                                    </Radio.Group>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                }
                {
                    focus &&
                    <Form className="form_pane">
                        <h3 className="divider"><span>焦点样式</span></h3>
                        <FormItem label="启用"><Checkbox checked={enable} disabled={_disabled} onChange={(e) => this.onFocus({ enable: e.target.checked, onview: e.target.checked })} /></FormItem>
                        <div style={{ display: enable ? 'block' : 'none' }}>
                            {
                                type !== 'Text'
                                ?
                                <Fragment>
                                    {
                                        type !== 'Image' &&
                                        <FormItem label="背景">
                                            <Button size="small">
                                                <ColorPicker
                                                    className={"colorPicker" + this.colorName(_backgroundColor)}
                                                    animation="slide-up"
                                                    color={_backgroundColor}
                                                    onChange={(colors) => this.onFocus({ backgroundColor: colors.color + this.toAlpha(colors.alpha) })}
                                                />
                                            </Button>
                                            <Button className={"img-load-btn" + this.colorName(_backgroundImage)} size="small" style={{ marginLeft: 10 }}>
                                                <input onChange={this.imgUpload("onFocus")} type="file" accept="image/*" id={"xFile-img-focus"} />
                                                <label htmlFor={"xFile-img-focus"} style={{ backgroundImage: _backgroundImage === 'unset' ? 'none' : `url(${_backgroundImage})` }} />
                                            </Button>
                                            <a className="color-reset-btn" onClick={() => this.onFocus({ backgroundColor: 'unset', backgroundImage: 'unset' })}>清除</a>
                                        </FormItem>
                                    }
                                    <FormItem label="边框">
                                        <Button size="small" style={{ marginRight: 10 }}>
                                            <ColorPicker
                                                className="colorPicker"
                                                animation="slide-up"
                                                color={_outlineColor}
                                                onChange={(colors) => this.onFocus({ outlineColor: colors.color + this.toAlpha(colors.alpha) })}
                                            />
                                        </Button>
                                        <Slider value={_outlineWidth} min={0} max={20} step={2} onChange={(value) => this.onFocus({ outlineWidth: value })} />
                                        <InputNumber style={{ width: 50 }} size="small" min={0} max={20} value={_outlineWidth} onChange={(value) => this.onFocus({ outlineWidth: value })} />
                                    </FormItem>
                                    <FormItem label="圆角">
                                        <Slider value={_borderRadius} min={0} max={20} onChange={(value) => this.onFocus({ borderRadius: value })} />
                                        <InputNumber style={{ width: 50 }} size="small" min={0} max={20} value={_borderRadius} onChange={(value) => this.onFocus({ borderRadius: value })} />
                                    </FormItem>
                                </Fragment>
                                :
                                <Fragment>
                                    <FormItem label="文字颜色">
                                        <Button size="small">
                                            <ColorPicker
                                                className="colorPicker"
                                                animation="slide-up"
                                                color={_color}
                                                onChange={(colors) => this.onFocus({ color: colors.color + this.toAlpha(colors.alpha) })}
                                            />
                                        </Button>
                                    </FormItem>
                                </Fragment>
                            }
                            <FormItem label="预览"><Checkbox checked={onview} onChange={(e) => this.onFocus({ onview: e.target.checked })} /></FormItem>
                        </div>
                    </Form>
                }
                {
                    select &&
                    <Form className="form_pane">
                        <h3 className="divider"><span>选中样式</span></h3>
                        <FormItem label="启用"><Checkbox disabled={$disabled} checked={$enable} onChange={(e) => this.onSelected({ enable: e.target.checked, onview: e.target.checked })} /></FormItem>
                        <div style={{ display: $enable ? 'block' : 'none' }}>
                            {
                                type !== 'Text'
                                ?
                                <Fragment>
                                    {
                                        type !== 'Image' &&
                                        <FormItem label="背景">
                                            <Button size="small">
                                                <ColorPicker
                                                    className={"colorPicker" + this.colorName($backgroundColor)}
                                                    animation="slide-up"
                                                    color={$backgroundColor}
                                                    onChange={(colors) => this.onSelected({ backgroundColor: colors.color + this.toAlpha(colors.alpha) })}
                                                />
                                            </Button>
                                            <Button className={"img-load-btn" + this.colorName($backgroundImage)} size="small" style={{ marginLeft: 10 }}>
                                                <input onChange={this.imgUpload("onSelected")} type="file" accept="image/*" id={"xFile-img-focus"} />
                                                <label htmlFor={"xFile-img-focus"} style={{ backgroundImage: $backgroundImage === 'unset' ? 'none' : `url(${$backgroundImage})` }} />
                                            </Button>
                                            <a className="color-reset-btn" onClick={() => this.onSelected({ backgroundColor: 'unset', backgroundImage: 'unset' })}>清除</a>
                                        </FormItem>
                                    }
                                    <FormItem label="边框">
                                        <Button size="small" style={{ marginRight: 10 }}>
                                            <ColorPicker
                                                className="colorPicker"
                                                animation="slide-up"
                                                color={$outlineColor}
                                                onChange={(colors) => this.onSelected({ outlineColor: colors.color + this.toAlpha(colors.alpha) })}
                                            />
                                        </Button>
                                        <Slider value={$outlineWidth} min={0} max={20} step={2} onChange={(value) => this.onSelected({ outlineWidth: value })} />
                                        <InputNumber style={{ width: 50 }} size="small" min={0} max={20} value={$outlineWidth} onChange={(value) => this.onSelected({ outlineWidth: value })} />
                                    </FormItem>
                                    <FormItem label="圆角">
                                        <Slider value={$borderRadius} min={0} max={20} onChange={(value) => this.onSelected({ borderRadius: value })} />
                                        <InputNumber style={{ width: 50 }} size="small" min={0} max={20} value={$borderRadius} onChange={(value) => this.onSelected({ borderRadius: value })} />
                                    </FormItem>
                                </Fragment>
                                :
                                <Fragment>
                                    <FormItem label="文字颜色">
                                        <Button size="small">
                                            <ColorPicker
                                                className="colorPicker"
                                                animation="slide-up"
                                                color={$color}
                                                onChange={(colors) => this.onSelected({ color: colors.color + this.toAlpha(colors.alpha) })}
                                            />
                                        </Button>
                                    </FormItem>
                                </Fragment>
                            }
                            <FormItem label="预览"><Checkbox checked={$onview} onChange={(e) => this.onSelected({ onview: e.target.checked })} /></FormItem>
                        </div>
                    </Form>
                }
            </div>
        );
    }
}
