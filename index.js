'use strict';

var _ = require('./src/helper');
var createStore = require('./src/Store');
var createDispatcher = require('./src/Dispatcher');

/**
 * Application constructor
 */
var FFlux = FFlux || {};

FFlux.createDispatcher = function() {
    return createDispatcher.call(null);
}

/**
 * Create new store
 * @param {object}      options     Configuration for the store
 * @return {FFluxStore} New instance of the store
 */
FFlux.createStore = function(options) {
    return createStore.call(null, options);
};

/**
 * Create object with action interface
 * @param  {string} type    Type of the action
 * @param  {object} data    Payload object
 * @return {object}         Object with action interface
 */
FFlux.createAction = function(type, data) {
    return {
        type: type,
        data: data
    };
};

FFlux.mixins = {};

FFlux.mixins.binding = {
    /**
     * Set `storeDidUpdate` listener to the specified store
     * @return {void}
     */
    componentDidMount: function() {
        this.listenTo.addListener('change', this.storeDidUpdate);
    },

    /**
     * Remove all `storeDidUpdate` callbacks from the binded store
     * @return {void}
     */
    componentWillUnmount: function () {
        this.listenTo.removeListener('change', this.storeDidUpdate);
    }
};

window.FFlux = FFlux;