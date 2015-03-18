'use strict';

var invariant = require('flux/lib/invariant');
var _ = require('./helper');

/**
 * Parse dehydrated data
 * @param  {String} dehydrated
 * @return {Object}
 */
function parseDehydratedState(dehydrated) {
    var stringifiedStores = dehydrated.split(';');
    var stores = {};
    var parsed;

    invariant(
        stringifiedStores.length,
        'You\'re trying to build a fflux scope from the ' +
        'dehydrated data, but provided string is corrupted.'
    );

    stringifiedStores.forEach(function(store) {
        parsed = JSON.parse(store);
        stores[parsed.name] = parsed.data;
    });

    return stores;
}

/**
 * DataScope constructor
 * @constructor
 */
function DataScope() {
    this._stores = {};
}

DataScope.prototype = {
    /**
     * Register store in the data scope
     * @param {Store} store 
     * @return {Scope}
     */
    register: function(name, store) {
        this._stores[name] = store;

        return this;
    },

    /**
     * Unregister store from the data scope
     * @param  {Store} store 
     * @return {Scope}
     */
    unregister: function(name) {
        this._stores[name] = null;

        return this;
    },

    /**
     * Get store by registered name
     * @param  {String} name 
     * @return {Store}
     */
    get: function(name) {
        return this._stores[name];
    },

    /**
     * Rehydrate data scope
     * @param  {String} dehydrated
     * @return {Scope}
     */
    rehydrate: function(dehydrated) {
        invariant(
            _.isString(dehydrated),
            'Dehydrated data must be a string (' + 
            typeof dehydrated + ' given)'
        );

        var parsedStores = parseDehydratedState(dehydrated);

        var registeredStores = Object.keys(this._stores);
        var storesToRehydrate = Object.keys(parsedStores);

        // @todo Compare and merge

        return this;
    },

    /**
     * Stringify scope
     * @return {String}
     */
    dehydrate: function() {
        var keys = Object.keys(this._stores);
        var dehydrated = '';
        var name;
        var item;

        for (var i in keys) {
            name = keys[i];
            item = this._stores[name];

            if (item !== null) {
                dehydrated += JSON.stringify({
                    name: name,
                    data: item.dehydrate()
                }) + ';';
            }
        }

        return dehydrated;
    }
};

module.exports = DataScope;