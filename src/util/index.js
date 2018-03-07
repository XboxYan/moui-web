function hasClass(obj, className) {
    if(obj.className){
        return obj.className.indexOf(className) > -1 ? true : false;
    }else{
        return false;
    }
}

function addClass(obj, className) {
    if (hasClass(obj, className) || !obj) return;
    if (obj.classList) {
        obj.classList.add(className);
    } else {
        obj.className += ' ' + className;
    }
}

function removeClass(obj, className) {
    if (hasClass(obj, className)) {
        var newClass = obj.className.replace(className, "");
        obj.className = newClass.replace(/(^\s*)/g, "");
    }
}

export default { hasClass,addClass,removeClass };