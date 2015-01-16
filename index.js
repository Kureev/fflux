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
     * Set `storeDidUpdate` listener to `listenTo` store(s)
     * @return {void}
     */
    componentDidMount: function() {
        if (_.isArray(this.listenTo) && this.listenTo.length) {
            for (var i = 0; i < this.listenTo.length; i++) {
                if (_.isObject(this.listenTo[i])) {
                    this.listenTo[i].addListener('change', this.storeDidUpdate);
                } else {
                    this.getStore(this.listenTo[i]).addListener('change', this.storeDidUpdate);
                }
            }
        } else {
            this.listenTo.addListener('change', this.storeDidUpdate);
        }
    },

    /**
     * Remove all `storeDidUpdate` callbacks from binded stores
     * @return {void}
     */
    componentWillUnmount: function () {
        if (_.isArray(this.listenTo) && this.listenTo.length) {
            for (var i = 0; i < this.listenTo.length; i++) {
                if (_.isObject(this.listenTo[i])) {
                    this.listenTo[i].removeListener('change', this.storeDidUpdate);
                } else {
                    this.getStore(this.listenTo[i]).removeListener('change', this.storeDidUpdate);    
                }
            }
        } else {
            this.listenTo.removeListener('change', this.storeDidUpdate);
        }
    }
};

window.FFlux = FFlux;