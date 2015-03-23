'use strict';

var FBDispatcher = require('flux/lib/Dispatcher');
var invariant = require('flux/lib/invariant');
var _ = require('./helper');

function Dispatcher() {
    /**
     * Create facebook's dispatcher realization
     * @type {Dispatcher}
     */
    this._dispatcher = new FBDispatcher();
}

_.extend(Dispatcher.prototype, {
    /**
     * Invoke dispatch method of the flux dispatcher's instance
     * @param {String} type Type of the action
     * @param {Object} data Payload of the action
     * @return {Void}
     */
    dispatch: function(type, data) {
        invariant(
            typeof type === 'string' &&
            (
                typeof data === 'object' ||
                typeof data === 'undefined'
            ),
            'Please check type of parameters you\'re passing to ' +
            'the `dispatch` function. First parameter(type) must ' +
            'be a string(' + typeof type + ' given), second parameter(data) ' +
            'must be an object/undefined(' + typeof data + ' given).'
        );

        this._dispatcher.dispatch({
            type: type,
            data: data
        });
    },
    
    /**
     * Bridge to dispatcher's waitFor
     * @param {Array} arrayOfStores Array of stores to wait for
     * @return {Void}
     */
    waitFor: function(arrayOfStores) {
        invariant(
            Object.prototype.toString.call(arrayOfStores) === '[object Array]',
            'Please check type of the parameter you\'re passing ' +
            'to the `waitFor` function. It must be an array of stores ' + 
            '(' + typeof action + ' given).'
        );

        arrayOfStores = arrayOfStores.map(function(store) {
            return store.dispatchToken;
        });

        this._dispatcher.waitFor(arrayOfStores);
    },

    /**
     * Register store to dispatcher
     * @param {FFluxStore} instance     FFluxStore instance
     * @return {Void}
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
     * @param {Object} store Store instance
     * @return {Void}
     */
    unregister: function(store) {
        invariant(
            _.isObject(store),
            'Please check type of the parameter you\'re passing to ' +
            'the `waitFor` function. It must be an array of stores ' +
            '(' + typeof action + ' given).'
        );

        this._dispatcher.unregister(store.dispatchToken);
        store.dispatchToken = null;
    }
});

module.exports = Dispatcher;