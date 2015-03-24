'use strict';

var invariant = require('flux/lib/invariant');
var _ = require('./helper');
var Dispatcher = require('./Dispatcher');
var DataScope = require('./DataScope');
var ActionScope = require('./ActionScope');

/**
 * Register object in the scope
 * @param  {Object} obj
 * @param  {Object} scope
 * @return {Object}
 */
function register(obj, scope) {
    if (obj) {
        Object.keys(obj).forEach(function(key) {
            scope.register(key, obj[key]);
        });
    }

    return scope;
}

/**
 * Create data scope
 * @param  {Dispatcher} dispatcher
 * @param  {Object} stores
 * @return {DataScope}
 */
function createDataScope(dispatcher, stores) {
    return register(stores, new DataScope(dispatcher));
}

/**
 * Create action scope
 * @param  {Dispatcher} dispatcher
 * @param  {Object} actions
 * @return {ActionScope}
 */
function createAcionScope(dispatcher, actions) {
    return register(actions, new ActionScope(dispatcher));
}

function Application(schema) {
    schema = schema || {};

    invariant(
        _.isObject(schema),
        'Schema should be an object (%s given)',
        typeof schema
    );

    var dispatcher = new Dispatcher();

    this._dispatcher = dispatcher;
    this._dataScope = createDataScope(dispatcher, schema.stores);
    this._actionScope = createAcionScope(dispatcher, schema.actions);
}

Application.prototype = {
    dispatcher: function() {
        return this._dispatcher;
    },

    stores: function() {
        return this._dataScope;
    },

    actions: function() {
        return this._actionScope;
    }
};

module.exports = Application;