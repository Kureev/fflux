'use strict';

/**
 * Check if param is an array
 * @param  {Any}  param
 * @return {Boolean}
 */
function isArray(param) {
    return Object.prototype.toString.call(param) === '[object Array]';
}

/**
 * Check if para is a string
 * @param {Any} param
 * @return {Boolean}
 */
function isString(param) {
    return Object.prototype.toString.call(param) === '[object String]';
}

/**
 * Check if param is an object
 * @param  {Any}  param
 * @return {Boolean}
 */
function isObject(param) {
    return Object.prototype.toString.call(param) === '[object Object]';
}

/**
 * Check if param is a function
 * @param  {Any}  param
 * @return {Boolean}
 */
function isFunction(param) {
    return Object.prototype.toString.call(param) === '[object Function]';
}

/**
 * Get object's keys
 * @param  {Object} obj
 * @return {Array}  Array of the keys
 */
function keys(obj) {
    return Object.keys(obj);
}

/**
 * Extend object by other obect(s)
 * @param  {Object} obj Object to extend
 * @return {Object}     Extended object
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
    isString: isString,
    isObject: isObject,
    isFunction: isFunction,
    extend: extend,
    clone: clone
};