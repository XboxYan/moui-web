import Immutable from 'immutable';
import defaultProps from './defaultProps';

const paseTree = (path) => {
    //View-0-1~0
    //View-children-0-children-1-item-0
    //[0,children,1,item,0]
    return path.replace(/-/g, '-children-').replace(/~/g, '-item-').replace(/@/g, '-tabs-').replace(/#/g, '-contents-').split('-').slice(2).map(value => value >= 0 ? Number(value) : value);
}

const ADD = (layout, index, type, { x, y },dynamic) => {
    const O = layout;
    const tree = paseTree(index);
    const c = O.getIn([...tree, 'children']);
    const e = c.indexOf(null);
    const $dynamic = dynamic?{dynamic:!!dynamic}:{};
    const Com = Immutable.fromJS({
        type, 
        style: { ...defaultProps[type].style,x, y }, 
        props: {...defaultProps[type].props,...$dynamic}, 
        item: defaultProps[type].item||null,
        tabs: defaultProps[type].tabs||null,
        contents: defaultProps[type].contents||null,
        datasource: defaultProps[type].datasource||null,
        datas: defaultProps[type].datas||null,
        children: []
    })
    if(e < 0){
        const $O = O.updateIn([...tree, 'children'], value => value.push(Com));
        return $O
    }else{
        const $O = O.setIn([...tree, 'children', e], Com);
        return $O
    }
}

const FOCUS = (layout, index) => {
    const O = layout;
    const tree = paseTree(index);
    const $O = O.getIn(tree);
    return $O;
}

const INIT = (layout) => {
    const $O = Immutable.fromJS([layout]);
    return $O;
}

const CHANGE = (layout, index, key_value, path) => {
    const O = layout;
    const tree = paseTree(index);
    const $O = O.updateIn([...tree, ...path],value=>value.merge(Immutable.fromJS(key_value)))
    return $O
}

const COPY = (layout, target, item, pos) => {
    const O = layout;
    const tree = paseTree(target);
    const $current = Immutable.fromJS(item).updateIn(['style'],value=>value.merge(Immutable.fromJS(pos)));
    const c = O.getIn([...tree, 'children']);
    const e = c.indexOf(null);
    if(e < 0){
        const $O = O.updateIn([...tree,'children'],value=>value.push($current))
        return $O
    }else{
        const $O = O.setIn([...tree, 'children', e], $current);
        return $O
    }
}

const ADDTAB = (layout,index,tabIndex) => {
    const O = layout;
    const tree = paseTree(index);
    const $tabs = Immutable.fromJS(defaultProps.TabView.tabs[0]);
    const $contents = Immutable.fromJS(defaultProps.TabView.contents[0]);
    const $O = O.updateIn([...tree,'tabs'],value=>value.insert(tabIndex+1,$tabs)).updateIn([...tree,'contents'],value=>value.insert(tabIndex+1,$contents));
    return $O
}

const DELTAB = (layout, index, tabIndex) => {
    const O = layout;
    const tree = paseTree(index);
    const $O = O.removeIn([...tree,'tabs',tabIndex]).removeIn([...tree,'contents',tabIndex]);
    return $O
}

const DELETE = (layout, index) => {
    const O = layout;
    const tree = paseTree(index);
    const $O = O.setIn(tree,null);
    return $O
}

const fixType = (index,type) => {
    const _index = index.split('>')[1];
    return type+_index;
}

const MOVE = (layout, pos, target, index, path) => {
    const O = layout; 
    const type = index.split('-')[0];
    let focusindex = index;
    const tree = paseTree(index);
    const current = O.getIn(tree);
    const $current = current.updateIn(path,value=>value.merge(Immutable.fromJS(pos)));
    if (index.slice(0, -2).split('>')[1] === target.split('>')[1]) {
        const $P = O.setIn(tree, $current);
        return [$P,focusindex]
    } else {
        const target_tree = paseTree(target);
        const $O = O.setIn(tree, null);
        const c = $O.getIn([...target_tree, 'children']);
        const e = c.indexOf(null);
        const n = c.size;
        if (e < 0) {
            const $P = $O.updateIn([...target_tree, 'children'], value => value.push($current));
            focusindex = fixType(target,type)+'-'+n;
            return [$P,focusindex]
        } else {
            const $P = $O.setIn([...target_tree, 'children', e], $current);
            focusindex = fixType(target,type)+'-'+e;
            return [$P,focusindex]
        }
    }
}

export { INIT, ADD, CHANGE, MOVE, FOCUS, COPY, DELETE, ADDTAB, DELTAB };