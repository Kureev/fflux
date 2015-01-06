'use strict';

var Dispatcher = require('./lib/Dispatcher');
var createStore = require('./lib/StoreFactory');
var createView = require('./lib/ViewFactory');

/**
 * Application constructor
 */
var Fluxy = function() {
    var _dispatcher = new Dispatcher();

    /**
     * Create new store
     * @param {options} Configuration for the store
     * @return {FluxyStore} New instance of the store
     */
    this.createStore = function(options) {
        return createStore.call(this, options);
    };

    /**
     * Create new React view
     * @param {options} Configuration for the view
     * @return {ReactView} New instance of the view
     */
    this.createView = function(options) {
        return createView.call(this, options);
    };

    /**
     * Dispatcher getter
     * @private
     * @return {Flux.Dispatcher}
     */
    this.getDispatcher = function() {
        return _dispatcher;
    };

    /**
     * Invoke dispatch method of the flux dispatcher's instance
     * @param {object} payload
     * @return true
     */
    this.dispatch = function(payload) {
        var dispatcher = this.getDispatcher();

        dispatcher.dispatch.call(dispatcher, payload);

        return true;
    };
};

module.exports = Fluxy;