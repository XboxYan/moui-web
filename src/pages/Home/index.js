import React, { PureComponent } from 'react';
import { Layout, Icon, Button } from 'antd';
import ProjectList from './ProjectList';
import CompoList from './CompoList';
import StoreProvider, { StoreContext } from '../../store';
import Image from '../../components/Image';
import View from '../../components/View';
import Text from '../../components/Text';
const { Header, Footer, Sider, Content } = Layout;

const type = {
  'View': View,
  'Text': Text,
  'Image': Image,
}


export default class Index extends PureComponent {
  obj = {}
  
  loop = (data, m = 'view') => data.map((item, i) => {
    const Tag = type[item.type];
    const key = m + '-' + i;
    let child = null;
    if (item.child && item.child.length) {
      child = this.loop(item.child, key)
    }
    return <Tag key={key} onFocus={this.onFocus} ref={(ref) => this.obj['view-' + item.id] = ref} style={item.style} {...item.props} >{child}</Tag>;
  });
  componentDidMount() {
    //console.log(this.refs.view.props.children.props.children[0].props)
  }

  render() {
    return (
      <StoreProvider>
        <Layout>
          <Header className="header">
            <div className="logo"><Icon type="cloud" /> Coship</div>
          </Header>
          <Layout>
            <Sider
              collapsedWidth={0}
              collapsible={true}
            >
              <ProjectList />
              <CompoList />
            </Sider>
            <Layout id='center'>
              <Content ref="view">
                <StoreContext.Consumer>
                  {context => (
                    this.loop(context.layout)
                  )}
                </StoreContext.Consumer>
              </Content>
              <Footer>
                Footer
            </Footer>
            </Layout>
            <Sider>
              <StoreContext.Consumer>
                {context => (
                  <Button onClick={context.dispatch}>Context 测试</Button>
                )}
              </StoreContext.Consumer>
              <Button onClick={this.onClick}>Layout 测试</Button>
            </Sider>
          </Layout>
        </Layout>
      </StoreProvider>
    );
  }
}
