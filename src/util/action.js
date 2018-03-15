import Immutable from 'immutable';

const paseTree = (path) => {
    //tree-0-0 => [0,child,0]   tree-child-0-child-0
    return path.replace(/-/g, '-child-').split('-').slice(2).map(value => value >= 0 ? Number(value) : value);
    //[tree,'child',0,'child',0] => [0,'child',0]
}

const ADD = (layout, index, type, { x, y }) => {
    const O = Immutable.fromJS(layout);
    const tree = paseTree(index);
    const Com = Immutable.fromJS({
        type, style: { x, y }, props: {}, child: []
    })
    const $O = O.updateIn([...tree, 'child'], value => value.push(Com));
    return $O.toJS()
}

const CHANGE = (layout, index, value, path) => {
    const O = Immutable.fromJS(layout);
    const tree = paseTree(index);
    const $O = O.setIn([...tree, ...path], value);
    return $O.toJS()
}

const MOVE = (layout, { x, y }, target, index, path) => {
    const O = Immutable.fromJS(layout);
    const target_tree = paseTree(target);
    const tree = paseTree(index);
    const current = O.getIn(tree);
    const $current = current.setIn([...path, 'x'], x).setIn([...path, 'y'], y)
    if (index.slice(0, -2) === target) {
        const $P = O.setIn(index, $current);
        return $P.toJS()
    } else {
        console.log(target, index)

        // current.setIn([...path,'x'],x);
        // current.setIn([...path,'y'],y);

        const $O = O.removeIn(tree);

        console.log($O.getIn([...target_tree, 'child']).toJS())

        const $P = $O.updateIn([...target_tree, 'child'], value => value.push($current));

        console.log($current.toJS())

        return $P.toJS()
    }


}

export { ADD, CHANGE, MOVE };