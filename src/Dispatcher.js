'use strict';

var Dispatcher = require('flux/lib/Dispatcher');
var invariant = require('flux/lib/invariant');
var _ = require('./helper');

function FFluxDispatcher() {
    /**
     * Create facebook's dispatcher realization
     * @type {Dispatcher}
     */
    this._dispatcher = new Dispatcher();

    /**
     * Invoke dispatch method of the flux dispatcher's instance
     * @param {string} type Type of the action
     * @param {object} data Payload of the action
     * @return {void}
     */
    this.dispatch = function(type, data) {
        this._dispatcher.dispatch.call(this._dispatcher, {
            type: type,
            data: data
        });
    };
    
    /**
     * Bridge to dispatcher's waitFor
     * @param {array} arrayOfStores Array of stores to wait for
     */
    this.waitFor = function(arrayOfStores) {
        arrayOfStores = arrayOfStores.map(function(store) {
            return store.dispatchToken;
        });

        this._dispatcher.waitFor.call(this._dispatcher, arrayOfStores);
    };
}

_.extend(FFluxDispatcher.prototype, {
    /**
     * Register store to dispatcher
     * @param {FFluxStore} instance     FFluxStore instance
     * @return {void}
     */
    register: function(instance) {
        instance.dispatchToken = this._dispatcher.register(function(action) {
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
                    }

                    invariant((typeof handler === 'function'),
                        'Function for action ' + type + 'isn\'t defined'
                    );
                    
                    handler.call(instance, action.data);
                }
            });
        });
    },

    /**
     * Unregister store from dispatcher
     * @param {object} options  Binding identificator or store instance
     * @return {void}
     */
    unregister: function(options) {
        var id;

        if (typeof options === 'string') {
            id = options;
        } else {
            id = options.dispatchToken;
        }

        this._dispatcher.unregister(id);
    }
});

module.exports = function() {
    return new FFluxDispatcher();
};