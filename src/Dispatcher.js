'use strict';

var Dispatcher = require('./vendor/Dispatcher');
var _ = require('./helper');

function FFluxDispatcher() {
    /**
     * Create facebook's dispatcher realization
     * @type {Dispatcher}
     */
    this._dispatcher = new Dispatcher();
    /**
     * Invoke dispatch method of the flux dispatcher's instance
     * @param {object} payload
     * @return true
     */
    this.dispatch = this._dispatcher.dispatch;
    
    /**
     * Bridge to dispatcher's waitFor
     * @param {array} arrayOfStores Array of stores to wait for
     */
    this.waitFor = this._dispatcher.waitFor;
}

_.extend(FFluxDispatcher.prototype, {
    /**
     * Register store to dispatcher
     * @param {FFluxStore} instance     FFluxStore instance
     * @return {string} Registration id
     */
    register: function(instance) {
        return this._dispatcher.register(function(action) {
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
            id = options._id;
        }

        this._dispatcher.unregister(id);
    }
});

module.exports = function() {
    return new FFluxDispatcher();
};