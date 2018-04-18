import React, { PureComponent } from 'react';
import { Button, Tooltip, message } from 'antd';
import Immutable from 'immutable';


export default class AppBar extends PureComponent {

  state = {
    history: Immutable.fromJS({})
  }

  historySize = 20;

  componentWillReceiveProps(nextProps) {
    if (this.props.store.pageList.length > 0) {
      if (nextProps.store.historyId !== this.props.store.historyId) {
        const { layout, index, pageIndex: [pageId] } = nextProps.store;
        const _history = this.state.history;
        const current = _history.get(pageId);
        const historyIndex = current.get('historyIndex');
        const size = current.get('layout').size
        if (historyIndex < size - 1) {
          const $history = _history.updateIn([pageId, 'layout'], value => value.setSize(historyIndex + 1).push(layout))
          const $H = $history.setIn([pageId, 'historyIndex'], historyIndex + 1);
          const $H2 = $H.updateIn([pageId, 'index'], value => value.setSize(historyIndex + 1).push(index));
          this.setState({ history: $H2 })
        } else {
          const $history = _history.updateIn([pageId, 'layout'], value => value.push(layout));
          const $H = $history.setIn([pageId, 'historyIndex'], $history.getIn([pageId, 'layout']).size - 1);
          const $H2 = $H.updateIn([pageId, 'index'], value => value.push(index));
          if (size >= this.historySize) {
            const $H3 = $H2.updateIn([pageId, 'layout'], value => value.shift()).updateIn([pageId, 'index'], value => value.shift()).setIn([pageId, 'historyIndex'], this.historySize - 1);
            this.setState({ history: $H3 })
          } else {
            this.setState({ history: $H2 })
          }
        }
      }
    } else {
      const { pageList } = nextProps.store;
      let data = {}
      pageList.forEach(d => {
        d.pages.forEach(el => {
          if (el.isPage >= 0) {
            data[el.id] = {
              name: el.name,
              layout: [],
              index: [],
              historyIndex: 0
            }
          }
        })
      })
      this.setState({ history: Immutable.fromJS(data) })
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onkeydown, false);
  }

  onkeydown = (ev) => {
    const { allowBack, allowReset } = this.isAllow();
    if (ev.keyCode === 90 && ev.ctrlKey) {
      if (allowBack) {
        ev.preventDefault();
        ev.stopPropagation();
        this.onAnction(-1)();
      } else {
        message.warn('已经是历史尽头了~');
      }

    }
    if (ev.keyCode === 89 && ev.ctrlKey) {
      if (allowReset) {
        ev.preventDefault();
        ev.stopPropagation();
        this.onAnction(1)();
      } else {
        message.warn('已经是最新状态了~');
      }
    }
  }

  onAnction = (step) => () => {
    const { updata, pageIndex: [pageId] } = this.props.store;
    const _history = Immutable.fromJS(this.state.history);
    const historyIndex = _history.getIn([pageId, 'historyIndex']) + step;
    const $H = _history.setIn([pageId, 'historyIndex'], historyIndex);
    const current = _history.getIn([pageId, 'layout', historyIndex]);
    const index = _history.getIn([pageId, 'index', historyIndex]);
    updata(current, index, false);
    this.setState({ history: $H })
  }

  isAllow = () => {
    const { pageIndex: [pageId] } = this.props.store;
    const { history } = this.state;
    const allowBack = history.get(pageId) && history.getIn([pageId, 'historyIndex']) > 0;
    const allowReset = history.get(pageId) && history.getIn([pageId, 'historyIndex']) < history.getIn([pageId, 'layout']).size - 1;
    return { allowBack, allowReset }
  }

  render() {
    const { allowBack, allowReset } = this.isAllow();
    return (
      <div className="app-bar">
        <Tooltip title="撤销"><Button onClick={this.onAnction(-1)} data-disabled={!allowBack} type="primary" shape="circle" icon="rollback" /></Tooltip>
        <Tooltip title="恢复"><Button onClick={this.onAnction(1)} data-disabled={!allowReset} className="btn-restore" type="primary" shape="circle" icon="rollback" /></Tooltip>
      </div>
    );
  }
}