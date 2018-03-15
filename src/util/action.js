import Immutable from 'immutable';

const paseTree = (path) => {
    //tree-0-0 => [0,child,0]   tree-child-0-child-0
    return path.replace(/-/g,'-child-').split('-').slice(2).map(value=>value>=0?Number(value):value);
    //[tree,'child',0,'child',0] => [0,'child',0]
}

const ADD = (layout,index,type,{x,y}) => {
    const O = Immutable.fromJS(layout);
    const tree = paseTree(index);
    const Com = Immutable.fromJS({
        type,style:{x,y},props:{},child:[]
    })
    const $O = O.updateIn([...tree,'child'],value=>value.push(Com));
    return $O.toJS()
}
export { ADD };