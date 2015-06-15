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

    stringifiedStores
        .filter(function(i) { return i.length; })
        .forEach(function(store) {
            parsed = JSON.parse(store);
            stores[parsed.name] = parsed.data;
        });

    return stores;
}

/**
 * DataScope constructor
 * @constructor
 * @param {Dispatcher} dispatcher
 */
function DataScope(dispatcher) {
    this._stores = {};
    this.length = 0;

    invariant(
        dispatcher,
        'You can\'t initialize data scope without dispatcher'
    );

    this._dispatcher = dispatcher;
}

DataScope.prototype = {
    /**
     * Register store in the data scope
     * @param {Store} store
     * @return {Scope}
     */
    register: function(name, store) {
        if (!store.dispatchToken) {
            this._dispatcher.register(store);
        }

        this._stores[name] = store;
        this.length++;

        return this;
    },

    /**
     * Unregister store from the data scope
     * @param  {Store} store
     * @return {Scope}
     */
    unregister: function(name) {
        this._dispatcher.unregister(this._stores[name]);
        this._stores[name] = null;
        this.length--;

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
     * Get all registered stores
     * @return {Object}
     */
    getAll: function() {
        return this._stores;
    },

    /**
     * Rehydrate data scope
     * @param  {String} dehydrated
     * @return {Scope}
     */
    rehydrate: function(dehydrated) {
        invariant(
            _.isString(dehydrated) ||
            _.isArray(dehydrated),
            'Dehydrated data must be a string or array (' +
            typeof dehydrated + ' given)'
        );

        invariant(
            this.length,
            'You can\'t rehydrate empty data scope'
        );

        var stores = this._stores;
        var parsedStores = {};

        if (_.isArray(dehydrated)) {
            dehydrated.forEach(function(store) {
                parsedStores[store.name] = store.data;
            });
        } else {
            parsedStores = parseDehydratedState(dehydrated);
        }

        Object.keys(stores).forEach(function(storeName) {
            if (parsedStores[storeName]) {
                stores[storeName].rehydrate(parsedStores[storeName]);
            }
        });

        return this;
    },

    /**
     * Stringify scope
     * @return {String}
     */
    dehydrate: function() {
        var dehydrated = '';
        var stores = this._stores;

        Object.keys(stores).map(function(key) {
            if (stores[key]) {
                dehydrated += JSON.stringify({
                    name: key,
                    data: stores[key].dehydrate()
                }) + ';';
            }
        });

        return dehydrated;
    }
};

module.exports = DataScope;
