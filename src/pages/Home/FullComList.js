import React, { PureComponent } from 'react';
import { baseCom, expCom, ComItem } from './CompoList';

export default class extends PureComponent {

  render() {
    const {show} = this.props;
    return (
      <div className="full-com-list" data-show={show}>
        {
          baseCom.map((d,i)=><ComItem column={true} key={i} item={d} />)
        }
        <div className="full-com-line"/>
        {
          expCom.map((d,i)=><ComItem column={true} key={i} item={d} />)
        }
      </div>
    );
  }
}