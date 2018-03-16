import React, { PureComponent } from 'react';
import { Layout, Icon, Button } from 'antd';
import ProjectList from './ProjectList';
import CompoList from './CompoList';
import PropsList from './PropsList';
import Center from './Center';
import StoreProvider, { StoreContext } from '../../store';
const { Header, Footer, Sider, Content } = Layout;



export default class Index extends PureComponent {

  obj = {}

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
                  {
                    context => <Center store={context} />
                  }
                </StoreContext.Consumer>
              </Content>
              <Footer>
                Footer
            </Footer>
            </Layout>
            <Sider width={250}>
              <StoreContext.Consumer>
                {
                  context => <PropsList store={context} />
                }
              </StoreContext.Consumer>
            </Sider>
          </Layout>
        </Layout>
      </StoreProvider>
    );
  }
}
