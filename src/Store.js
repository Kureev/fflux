'use strict';

var _ = require('./helper');
var Immutable = require('immutable');
var EventEmitter = require('events').EventEmitter;

/**
 * Store instance constructor
 */
function FFluxStore(options) {
    _.extend(this, {
        actions: {}
    }, options);

    this.state = this.getInitialState();
}

/**
 * Inherit store prototype from event emitter and passed options
 */
_.extend(FFluxStore.prototype, EventEmitter.prototype, {
    /**
     * Emit change
     * @return {void}
     */
    emitChange: function() {
        this.emit('change');
    },

    /**
     * Get initial state of the store
     * @return {Object}
     */
    getInitialState: function() {
        return Immutable.Map();
    },

    /**
     * Set state
     * @param {Object} state
     * @return {Void}
     */
    setState: function(state) {
        var oldState = this.state;
        var newState = this.state.mergeDeep(state);

        if (oldState !== newState) {
            this.state = newState;
            this.emitChange();
        }
    },

    /**
     * Represent current store state as JSON
     * @return {Object}
     */
    toJSON: function() {
        return this.state.toJSON();
    },

    /**
     * Get copy of the actions hash
     * @return {object} Copy of the actions
     */
    getActions: function() {
        return _.clone(this.actions);
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
};