'use strict';

var _ = require('./helper');
var invariant = require('flux/lib/invariant');
var Immutable = require('immutable');
var MutableStore = require('./MutableStore');

/**
 * Immutable store constructor
 * @param {Object} options
 */
function ImmutableStore(options) {
    _.extend(this, {
        actions: {},
        state: Immutable.fromJS(this.getInitialState())
    }, options);
}

/**
 * Inherit store prototype from event emitter and passed options
 */
_.extend(ImmutableStore.prototype, MutableStore.prototype, {
    /**
     * Set state of the store
     * @param {Object} state
     * @return {Void}
     */
    setState: function(path, stateMutator) {
        var toString = Object.prototype.toString;
        invariant(
            toString.call(path) === '[object Array]' &&
            toString.call(stateMutator) === '[object Function]',
            'FFlux Store: You\'re trying to use a `setState` function ' +
            'with wrong parameters. `setState(a: Array, b: Function)` expected'
        );
        
        var newState = this.state.deepMergeIn(path, stateMutator);

        if (Immutable.is(this.state, newState) === false) {
            this.state = newState;
            this.emitChange();
        }
    },

    /**
     * Get link to immutable state
     * @return {Object} state
     */
    getState: function() {
        return this.state;
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

        var newState = Immutable.fromJS(state);
        
        if (!Immutable.is(newState, this.state)) {
            this.state = newState;
            this.emitChange();
        }
    }
});

module.exports = ImmutableStore;