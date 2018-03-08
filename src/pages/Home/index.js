import React, { PureComponent } from 'react';
import { Layout, Icon } from 'antd';
import SiderLeft from './SiderLeft';
import Image from '../../components/Image';
import View from '../../components/View';
import Text from '../../components/Text';
const { Header, Footer, Sider, Content } = Layout;


export default class Index extends PureComponent {
  dragEnd = (a) => {
    console.log(a.overObj)
  }
  resizeEnd = ({ target, x, y, w, h }) => {
    console.log(target, x, y, w, h)
  }
  onChange = (value) => {
    console.log(value)
  }
  componentDidMount() {
    //console.log(this.refs.view)
  }
  render() {
    return (
      <Layout>
        <Header className="header">
          <div className="logo"><Icon type="cloud" /> Coship</div>
        </Header>
        <Layout>
          <Sider
            collapsedWidth={0}
            collapsible={true}
          >
            <SiderLeft />
            <div style={{ flex: 1, background: 'royalblue' }}></div>
          </Sider>
          <Layout>
            <Content>
              <View w={'100%'} h={'100%'} onChange={this.onChange} editable={false}>
                <View dragEnd={this.dragEnd} ref="view" w={200} h={200}>
                  <Image dragEnd={this.dragEnd}  x={20} y={20} />
                </View>
                <Image dragEnd={this.dragEnd} resizeEnd={this.resizeEnd} src="http://img.kuqin.com/upimg/allimg/160526/210301J61-1.png" w={150} x={200} y={200} />
                <Text x={50} y={150} text="和经济环境开会就开会就看很近很近" onChange={this.onChange} />
                <Text multiline={false} x={50} y={200} />
              </View>
            </Content>
            <Footer>Footer</Footer>
          </Layout>
          <Sider>2</Sider>
        </Layout>
      </Layout>
    );
  }
}
