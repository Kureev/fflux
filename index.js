'use strict';

var Dispatcher = require('./lib/Dispatcher');
var createStore = require('./lib/StoreFactory');
var createView = require('./lib/ViewFactory');

var NOT_FOUND = -1;

/**
 * Application constructor
 */
var Fluxy = function() {
    var _dispatcher = new Dispatcher();

    /**
     * Create new store
     * @param {options}     Configuration for the store
     * @return {FluxyStore} New instance of the store
     */
    this.createStore = function(options) {
        return createStore.call(this, options);
    };

    /**
     * Create object with action interface
     * @param  {string} type       Type of the action
     * @param  {object} payload    Payload object
     * @return {object}            Object with action interface
     */
    this.createAction = function(type, payload) {
        var action = {
            type: type
        };

        return _.extend(action, payload);
    };

    /**
     * Create new React view
     * @param {options}     Configuration for the view
     * @return {ReactView}  New instance of the view
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
     * Register store to dispatcher
     * @param {FluxyStore} instance     FluxyStore instance
     * @return {string} Registration id
     */
    this.register = function(instance) {
        return _dispatcher.register(function(payload) {
            var type = payload.type;
            var actionKeys = _.keys(instance.actions);

            // Check if we have something to wait for
            // see http://facebook.github.io/flux/docs/dispatcher.html
            // for more details
            if (instance.waitFor.length) {
                _dispatcher.waitFor(instance.waitFor);
            }

            var handler = instance[instance.actions[type]];

            // If we have such actions listener, invoke 
            // related function with payload provided
            if (actionKeys.indexOf(type) !== NOT_FOUND) {
                handler.call(instance, payload);
            }
        });
    };

    /**
     * Unregister store from dispatcher
     * @param {object} options  Binding identificator or store instance
     * @return {void}
     */
    this.unregister = function(options) {
        var id;

        if (typeof options === 'string') {
            id = options;
        } else {
            id = options._id;
        }

        _dispatcher.unregister(id);
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