'use strict';

var _ = require('./helper');
var EventEmitter = require('events').EventEmitter;

/**
 * Store instance constructor
 */
function FFluxStore(options) {
    this.actions = options.actions || {};
};

/**
 * Inherit store prototype from event emitter and passed options
 */
_.extend(constr.prototype, EventEmitter.prototype, {
    /**
     * Emit change
     * @return {void}
     */
    emitChange: function() {
        this.emit('change');
    },

    /**
     * Register action's handler
     * @param  {string} action  Action's name
     * @param  {function} handler Aciont's handler
     * @return {void}
     */
    registerAction: function(action, handler) {
        if (this.actions[action]) {
            throw Error('You can\'t override existing handler. Unregister it first!');
        }

        this.actions[action] = handler;
    },

    /**
     * Unregister action's handler from store
     * @param  {string} action Action name
     * @return {void}
     */
    unregisterAction: function(action) {
        if (this.actions[action]) {
            delete this.actions[action];
        } else {
            throw Error('You have no handlers for action ' + action);
        }
    }
});

/**
 * Store factory
 * @param  {object}     options             Configuration of the store instance
 * @return {function}   New store instance
 */
module.exports = function(options) {
    return new FFluxStore(options);
}