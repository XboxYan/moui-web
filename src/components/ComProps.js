export default class ComProps {
    
    constructor(type, [x=0, y=0, w=0, h=0]) {
        this.type = type;
        this.style = {
            x,
            y,
            w,
            h
        }
    }

    parent = null;

    children = [];

}