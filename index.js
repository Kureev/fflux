'use strict';

var createStore = require('./src/Store');
var createDispatcher = require('./src/Dispatcher');

/**
 * Application constructor
 */
var FFlux = FFlux || {};

FFlux.createDispatcher = function() {
    return createDispatcher.call(null);
};

/**
 * Create new store
 * @param {object}      options     Configuration for the store
 * @return {FFluxStore} New instance of the store
 */
FFlux.createStore = function(options) {
    return createStore.call(null, options);
};

FFlux.mixins = {};

/**
 * Bind mixin for React views
 * @param  {object} store Store the React view will bind to
 * @return {object}       Mixin for the specified store
 */
FFlux.mixins.bind = function(store) {
    return {
        /**
         * Set `storeDidUpdate` listener to the specified store
         * @return {void}
         */
        componentDidMount: function() {
            store.addListener('change', this.storeDidUpdate);
        },

        /**
         * Remove all `storeDidUpdate` callbacks from the binded store
         * @return {void}
         */
        componentWillUnmount: function () {
            store.removeListener('change', this.storeDidUpdate);
        }
    };
};

if (typeof require === 'function') {
    module.exports = FFlux;
} else {
    window.FFlux = FFlux;
}