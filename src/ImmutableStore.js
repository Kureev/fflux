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
        actions: {}
    }, options);

    this.state = Immutable.fromJS(this.getInitialState());
}

/**
 * Inherit store prototype from event emitter and passed options
 */
_.extend(ImmutableStore.prototype, MutableStore.prototype, {
    /**
     * Update state
     * @private
     * @param  {Object|Immutable} newState 
     * @return {Void}
     */
    _updateState: function(newState) {
        if (Immutable.is(newState, this.state) === false) {
            this.state = newState;
            this.emitChange();
        }
    },

    /**
     * Set new state by merge
     * @see http://facebook.github.io/immutable-js/docs/#/Map/merge
     * @param {Object|Immutable} patch
     * @return {Void}
     */
    setState: function(patch) {
        this._updateState(this.state.merge(patch));
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
     * @see http://facebook.github.io/immutable-js/docs/#/Map/withMutations
     * @param  {Object|Immutable} state
     * @return {Void}
     */
    replaceState: function(state) {
        invariant(
            _.isObject(state),
            'FFlux Store: You\'re attempting to use a non-object type to ' +
            'replace your store\'s state. Function `replaceState` accepts ' +
            'only object as a parameter.'
        );
        
        this._updateState(Immutable.fromJS(state));
    }
});

module.exports = ImmutableStore;