'use strict';

/**
 * Store factory
 * @param  {object} options Configuration of the store instance
 * @param {boolean} shouldRegister Automatic registration flag
 * @return {function} New store instance
 */
module.exports = function(options, shouldRegister) {
    // Simplify the scope usage
    var app = this;

    // If shouldRegister wasn't specified,
    // register by default
    if (shouldRegister === undefined) {
        shouldRegister = true;
    }

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

    // If we don't need to register the store
    // automaticly, return the built instance
    if (shouldRegister !== true) {
        return instance;
    }

    // Register store callback to the application dispatcher
    instance._id = app.register(instance);

    return instance;
};