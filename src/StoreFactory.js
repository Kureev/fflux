'use strict';

/**
 * Store factory
 * @param  {object} options Configuration of the store instance
 * @return {function} New store instance
 */
module.exports = function(options) {

    var NOT_FOUND = -1;

    /**
     * Store instance constructor
     */
    var constr = function FluxyStore() {
        this.actions = options.actions || {};
        this.waitFor = options.waitFor || [];
    };

    // Inherit store prototype from bb events and passed options
    _.extend(constr.prototype, Backbone.Events, options);

    // Create instance
    var instance = new constr();

    // Register store callback to the application dispatcher
    this.getDispatcher().register(function(payload) {
        var action = payload.action;
        var actionKeys = _.keys(instance.actions);

        // Check if we have something to wait for
        // see http://facebook.github.io/flux/docs/dispatcher.html
        // for more details
        if (instance.waitFor.length) {
            this.getDispatcher().waitFor(instance.waitFor);
        }

        // If we have such actions listener, invoke 
        // related function with payload provided
        if (actionKeys.indexOf(action.actionName) !== NOT_FOUND) {
            instance[action.actionName].call(instance, payload);
        }
    });

    return instance;
};