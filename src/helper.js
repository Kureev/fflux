'use strict';

/**
 * Check if param is an array
 * @param  {any}  param
 * @return {boolean}
 */
function isArray(param) {
    return Object.prototype.toString.call(param) === '[object Array]';
}

/**
 * Check if param is an object
 * @param  {any}  param
 * @return {boolean}
 */
function isObject(param) {
    return Object.prototype.toString.call(param) === '[object Object]';
}

/**
 * Check if param is a function
 * @param  {any}  param
 * @return {boolean}
 */
function isFunction(param) {
    return Object.prototype.toString.call(param) === '[object Function]';
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

/**
 * Clone object(not deep) or array
 * @param  {object} obj Object/Array to Clone
 * @return {object}     Clonned instance of the source
 */
function clone(obj) {
    return isArray(obj) ? obj.slice() : extend({}, obj);
}

module.exports = {
    keys: keys,
    isArray: isArray,
    isObject: isObject,
    isFunction: isFunction,
    extend: extend,
    clone: clone
};