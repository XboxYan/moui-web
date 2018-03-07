import React, { Component } from 'react';
import { Layout } from 'antd';
import Image from '../components/Image';
import View from '../components/View';
import Text from '../components/Text';
const { Header, Footer, Sider, Content } = Layout;


class Index extends Component {
  dargEnd = ({target,overTarget,x,y}) => {
    console.log(target,overTarget,x,y)
  }
  onChange = (value) => {
    console.log(value)
  }
  render() {
    return (
      <Layout>
        <Header>Header</Header>
        <Layout>
          <Sider>Sider</Sider>
          <Content>
            <View w={'100%'} h={'100%'}  onChange={this.onChange} editable={false}>
              <View w={200} h={200}>
                <Image x={20} y={20} />
              </View>
              <Image src="http://img.kuqin.com/upimg/allimg/160526/210301J61-1.png" x={200} y={200} />
              <Text x={50} y={150} text="和经济环境开会就开会就看很近很近" onChange={this.onChange} />
              <Text multiline={false} x={50} y={200} />
            </View>
          </Content>
        </Layout>
        <Footer>Footer</Footer>
      </Layout>
    );
  }
}

export default Index;
