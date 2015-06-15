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
        var currentState = this.getState() || Immutable.Map();

        this._updateState(currentState.merge(patch));
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
    },


    /**
     * Dehydrate the store
     * @return {String}
     */
    dehydrate: function() {
        return JSON.stringify(this.state.toJSON());
    },

    /**
     * Rehydrate the store
     * @param {String|Object} data Data for rehydration
     * @return {Void}
     */
    rehydrate: function(data) {
        this.state = Immutable.fromJS(
            _.isObject(data) ? data : JSON.parse(data)
        );
    }
});

module.exports = ImmutableStore;
