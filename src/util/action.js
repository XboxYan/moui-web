import Immutable from 'immutable';

const paseTree = (path) => {
    return path.replace(/-/g, '-child-').split('-').slice(2).map(value => value >= 0 ? Number(value) : value);
}

const ADD = (layout, index, type, { x, y }) => {
    const O = layout;
    const tree = paseTree(index);
    const Com = Immutable.fromJS({
        type, style: { x, y }, props: {}, child: []
    })
    const $O = O.updateIn([...tree, 'child'], value => value.push(Com));
    return $O
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

export { ADD, CHANGE, MOVE, FOCUS };