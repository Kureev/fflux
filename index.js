'use strict';

var _ = require('./src/helper');
var Dispatcher = require('./src/Dispatcher');
var createStore = require('./src/StoreFactory');

/**
 * Application constructor
 */
var FFlux = function() {
    var _dispatcher = new Dispatcher();

    /**
     * Create new store
     * @param {options}     Configuration for the store
     * @return {FFluxStore} New instance of the store
     */
    this.createStore = function(options, settings) {
        return createStore.call(this, options, settings);
    };

    /**
     * Create object with action interface
     * @param  {string} type    Type of the action
     * @param  {object} data    Payload object
     * @return {object}         Object with action interface
     */
    this.createAction = function(type, data) {
        return {
            type: type,
            data: data
        };
    };

    /**
     * Create new React view
     * @param {options} options Configuration for the view
     * @return {ReactView}      New instance of the view
     *
     *  this.createView = function(options) {
     *      return createView.call(this, options);
     *  };
     */

    this.waitFor = function(arrayOfStores) {
        _dispatcher.waitFor(arrayOfStores);
    };

    /**
     * Register store to dispatcher
     * @param {FFluxStore} instance     FFluxStore instance
     * @return {string} Registration id
     */
    this.register = function(instance) {
        return _dispatcher.register(function(action) {
            var type = action.type;
            var handler;
            // Get array of registered actions
            var actionKeys = _.keys(instance.actions);

            // If we have such actions listener(s), invoke 
            // related function with action provided
            actionKeys.forEach(function(key) {
                if (key === type) {
                    switch (typeof instance.actions[type]) {
                        case 'string':
                            handler = instance[instance.actions[type]];
                            break;
                        case 'function':
                            handler = instance.actions[type];
                            break;
                        default:
                            throw Error('You must specify handler for action ' + type);
                    }
                    
                    handler.call(instance, action.data);
                }
            });
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
        _dispatcher.dispatch.call(_dispatcher, payload);

        return true;
    };
};

FFlux.mixins = {};

FFlux.mixins.binding = {
    /**
     * Set `onChange` listener to `listenTo` store(s)
     * @return {void}
     */
    componentDidMount: function() {
        if (_.isArray(this.listenTo) && this.listenTo.length) {
            for (var i = 0; i < this.listenTo.length; i++) {
                this.listenTo[i].addEventListener('change', this.onChange);
            }
        } else {
            this.listenTo.addListener('change', this.onChange);
        }
    },

    /**
     * Remove all `onChange` callbacks from binded stores
     * @return {void}
     */
    componentWillUnmount: function () {
        if (_.isArray(this.listenTo) && this.listenTo.length) {
            for (var i = 0; i < this.listenTo.length; i++) {
                this.listenTo[i].removeListener('change', this.onChange);
            }
        } else {
            this.listenTo.removeListener('change', this.onChange);
        }
    }
};

window.FFlux = FFlux;