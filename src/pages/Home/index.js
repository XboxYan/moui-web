import React, { PureComponent } from 'react';
import { Layout, Icon, Breadcrumb } from 'antd';
import ProjectList from './ProjectList';
import CompoList from './CompoList';
import PropsList from './PropsList';
import Center from './Center';
import StoreProvider, { StoreContext } from '../../store';
const { Header, Footer, Sider, Content } = Layout;

class TreeNode extends PureComponent {
  paseTree = (path) => {
    let tree = [];
    let [type,_path] = path.split('>-0');
    let $path = ((_path.replace(/-/g, 'View').replace(/~/g, 'ListView').replace(/@/g, 'TabView').replace(/#/g, 'TabView').replace(/[0-9]/g,','))+type).split(',');
    $path.forEach((el,i)=>{
      tree.push({
        name:i===0?'根节点':el,
        index:el+'>-0'+ _path.slice(0, i*2)
      })
    })
    return tree;
  }
  onFocus = (index) => () => {
    const { focus } = this.props.store;
    document.getElementById(index).focus();
    focus(index);
  }
  render() {
    const { index } = this.props.store;
    if(!index){
      return null;
    }
    const tree = this.paseTree(index);
    return (
      <Breadcrumb separator=">">
        {
          tree.map((el,i)=><Breadcrumb.Item key={i} data-current={i===tree.length-1}><a onClick={this.onFocus(el.index)}>{el.name}</a></Breadcrumb.Item>)
        }
      </Breadcrumb>
    )
  }
}

export default class Index extends PureComponent {

  render() {
    return (
      <StoreProvider>
        <Layout>
          <Header className="header">
            <div className="logo"><Icon type="cloud" /> Coship</div>
          </Header>
          <Layout>
            <Sider
              width={220}
              collapsedWidth={0}
              collapsible={true}
            >
              <ProjectList />
              <CompoList />
            </Sider>
            <Layout>
              <Content>
                <StoreContext.Consumer>
                  {
                    context => <Center store={context} />
                  }
                </StoreContext.Consumer>
              </Content>
              <Footer>
                <StoreContext.Consumer>
                  {
                    context => <TreeNode store={context} />
                  }
                </StoreContext.Consumer>
              </Footer>
            </Layout>
            <Sider width={260}>
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
