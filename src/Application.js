'use strict';

var invariant = require('flux/lib/invariant');
var _ = require('./helper');
var Dispatcher = require('./Dispatcher');
var DataScope = require('./DataScope');
var ActionScope = require('./ActionScope');

/**
 * Create data scope
 * @param  {Dispatcher} dispatcher
 * @param  {Object} stores
 * @return {DataScope}
 */
function createDataScope(dispatcher, stores) {
    var scope = new DataScope(dispatcher);

    if (stores) {
        Object.keys(stores).forEach(function(key) {
            scope.register(key, stores[key]);
        });
    }

    return scope;
}

/**
 * Create action scope
 * @param  {Dispatcher} dispatcher
 * @param  {Object} actions
 * @return {ActionScope}
 */
function createAcionScope(dispatcher, actions) {
    var scope = new ActionScope(dispatcher);

    if (actions) {
        Object.keys(actions).forEach(function(key) {
            scope.register(key, actions[key]);
        });
    }

    return scope;
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