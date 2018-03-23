import Immutable from 'immutable';
import defaultProps from './defaultProps';

const paseTree = (path) => {
    //View-0-1~0
    //View-child-0-child-1-item-0
    //[0,child,1,item,0]
    return path.replace(/-/g, '-child-').replace(/~/g, '-item-').replace(/@/g, '-tabs-').replace(/#/g, '-contents-').split('-').slice(2).map(value => value >= 0 ? Number(value) : value);
}

const ADD = (layout, index, type, { x, y }) => {
    const O = layout;
    const tree = paseTree(index);
    const c = O.getIn([...tree, 'child']);
    const e = c.indexOf(null);
    const Com = Immutable.fromJS({
        type, 
        style: { ...defaultProps[type].style,x, y }, 
        props: {...defaultProps[type].props}, 
        item: defaultProps[type].item?[defaultProps[type].item]:null,
        tabs: defaultProps[type].tabs?[defaultProps[type].tabs]:null,
        contents: defaultProps[type].contents?[defaultProps[type].contents]:null,
        datasource: defaultProps[type].datasource||null,
        datas: defaultProps[type].datas||null,
        child: []
    })
    if(e < 0){
        const $O = O.updateIn([...tree, 'child'], value => value.push(Com));
        return $O
    }else{
        const $O = O.setIn([...tree, 'child', e], Com);
        return $O
    }
}

const FOCUS = (layout, index) => {
    const O = layout;
    const tree = paseTree(index);
    const $O = O.getIn(tree);
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
    const c = O.getIn([...tree, 'child']);
    const e = c.indexOf(null);
    if(e < 0){
        const $O = O.updateIn([...tree,'child'],value=>value.push($current))
        return $O
    }else{
        const $O = O.setIn([...tree, 'child', e], $current);
        return $O
    }
}

const DELETE = (layout, index) => {
    const O = layout;
    const tree = paseTree(index);
    const $O = O.setIn(tree,null);
    return $O
}

const MOVE = (layout, pos, target, index, path) => {
    const O = layout; 
    let focusindex = index;
    const tree = paseTree(index);
    const current = O.getIn(tree);
    const $current = current.updateIn(path,value=>value.merge(Immutable.fromJS(pos)));
    if (index.slice(0, -2) === target) {
        const $P = O.setIn(tree, $current);
        return [$P,focusindex]
    } else {
        const target_tree = paseTree(target);
        const $O = O.setIn(tree, null);
        const c = $O.getIn([...target_tree, 'child']);
        const e = c.indexOf(null);
        const n = c.size;
        if (e < 0) {
            const $P = $O.updateIn([...target_tree, 'child'], value => value.push($current));
            focusindex = target+'-'+n;
            return [$P,focusindex]
        } else {
            const $P = $O.setIn([...target_tree, 'child', e], $current);
            focusindex = target+'-'+e;
            return [$P,focusindex]
        }
    }
}

export { ADD, CHANGE, MOVE, FOCUS, COPY, DELETE };