'use strict';

var invariant = require('flux/lib/invariant');
var _ = require('./helper');

/**
 * Action scope constructor
 * @constructor
 * @param {Object} options
 */
function ActionScope(options) {
    invariant(
        options.dispatcher,
        'You must pass a valid dispatcher instance to ' +
        'ActionScope constructor, "%s" given',
        options.dispatcher
    );

    this._actions = {};
    this._dispatcher = options.dispatcher;
}

ActionScope.prototype = {
    /**
     * Add action to action scope
     * @param {String} name   
     * @param {Object} actions
     */
    add: function(name, actions) {
        invariant(
            _.isObject(actions),
            'Action must be a function, ' +
            '%s given', 
            typeof actions
        );

        this._actions[name] = this._wrapActions(actions);
    },

    /**
     * Remove action from action scope
     * @param  {String} name 
     * @return {Void}
     */
    remove: function(name) {
        this._actions[name] = null;
    },

    /**
     * Get actions scope
     * @param  {String} name
     * @return {Object}
     */
    get: function(name) {
        return this._actions[name];
    },

    /**
     * Wrap actions to apply some extra arguments 
     * (like `dispatch` method) to functions
     * @private
     * @param  {Object} actions Actions to wrap
     * @return {Object} Wrapped actions
     */
    _wrapActions: function(actions) {
        var wrappedActions = {};
        var actionNames = Object.keys(actions);
        var dispatch = this._dispatcher.dispatch.bind(this._dispatcher);
        var args = [dispatch];

        actionNames.forEach(function(name) {
            wrappedActions[name] = function() {
                return actions[name]
                    .apply(null, 
                        args.concat(Array.prototype.slice.call(arguments))
                    );
            };
        });

        return wrappedActions;
    }
};

module.exports = ActionScope;