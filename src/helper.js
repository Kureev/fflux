'use strict';

function isObject(param) {
    return Object.prototype.toString.call(param) === '[object Object]';  
}

function isArray(param) {
    return Object.prototype.toString.call(param) === '[object Array]';
}

function keys(obj) {
    return Object.keys(obj);
}

function extend(obj) {
    if (!isObject(obj)) {
        return obj;
    }

    var source, prop;

    for (var i = 1, length = arguments.length; i < length; i++) {
        source = arguments[i];
        for (prop in source) {
            if (Object.hasOwnProperty.call(source, prop)) {
                obj[prop] = source[prop];
            }
        }
    }

    return obj;
}

module.exports = {
    keys: keys,
    isArray: isArray,
    isObject: isObject,
    extend: extend
};