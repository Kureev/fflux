'use strict';

/**
 * Check if param is object
 * @param  {any}  param Parameter to check
 * @return {boolean}
 */
function isObject(param) {
    return Object.prototype.toString.call(param) === '[object Object]';  
}

/**
 * Check if param is array
 * @param  {any}  param Parameter to check
 * @return {boolean}
 */
function isArray(param) {
    return Object.prototype.toString.call(param) === '[object Array]';
}

/**
 * Get object's keys
 * @param  {object} obj
 * @return {array}  Array of the keys
 */
function keys(obj) {
    return Object.keys(obj);
}

/**
 * Extend object by other obect(s)
 * @param  {object} obj Object to extend
 * @return {object}     Extended object
 */
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