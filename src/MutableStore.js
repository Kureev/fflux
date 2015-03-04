'use strict';

var _ = require('./helper');
var invariant = require('flux/lib/invariant');
var EventEmitter = require('events').EventEmitter;

/**
 * Mutable store instance constructor
 * @param {Object} options 
 */
function MutableStore(options) {
    _.extend(this, {
        actions: {},
        state: this.getInitialState()
    }, options);
}

/**
 * Inherit store prototype from event emitter and passed options
 */
_.extend(MutableStore.prototype, EventEmitter.prototype, {
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
        return {};
    },

    /**
     * Set state of the store
     * @param {Object} state
     * @return {Void}
     */
    setState: function(patch) {
        var toString = Object.prototype.toString;
        invariant(
            toString.call(patch) === '[object Object]',
            'FFlux Store: You\'re trying to use a `setState` function ' +
            'with a non-object parameter.'
        );
        
        _.extend(this.state, patch);

        this.emitChange();
    },

    /**
     * Get mutable copy of the state
     * @return {Object} state
     */
    getState: function() {
        return _.clone(this.state);
    },

    /**
     * Replace state of the store
     * @param  {Object} state
     * @return {Void}
     */
    replaceState: function(state) {
        invariant(
            typeof state === 'object',
            'FFlux Store: You\'re attempting to use a non-object type to ' +
            'replace your store\'s state. Function `replaceState` accepts ' +
            'only object as a parameter.'
        );

        this.state = _.clone(state);
        this.emitChange();
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
        invariant(
            typeof action === 'string' &&
            typeof handler === 'function',
            'Please check the parameters you\'re passing to the ' +
            'registerAction function. First parameter(action) must ' +
            'be a string, second parameter(handler) must be a function.'
        );

        invariant(
            !this.actions[action],
            'You\'ve already registered action with `' + action + 
            '` name. You can\'t override existing action, so if ' +
            'you want to change the handler please, ' +
            'unregister existing one first.'
        );

        this.actions[action] = handler;
    },

    /**
     * Unregister action's handler from store
     * @param  {string} action Action name
     * @return {void}
     */
    unregisterAction: function(action) {
        invariant(
            typeof action === 'string',
            'Please check type of the parameter you\'re passing to the ' +
            '`unregisterAction` function. It must be a string ' + 
            '(got ' + typeof action + ' instead).'
        );

        if (this.actions[action]) {
            delete this.actions[action];
        }
    }
});

module.exports = MutableStore;