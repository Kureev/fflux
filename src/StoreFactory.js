'use strict';

/**
 * Store factory
 * @param  {object}     options             Configuration of the store instance
 * @param  {boolean}    settings.register   Automatic registration flag
 * @return {function}   New store instance
 */
module.exports = function(options, settings) {
    settings = settings || {};

    // If settings.register wasn't specified,
    // register by default
    if (settings.register === undefined) {
        settings.register = true;
    }
    
    // Simplify the scope usage
    var app = this;
    var _id;

    /**
     * Store instance constructor
     */
    var constr = function FFluxStore() {
        this.actions = options.actions || {};
    };

    // Inherit store prototype from bb events and passed options
    _.extend(constr.prototype, Backbone.Events, {
        /**
         * Get registered callback id
         * @return {string} Id of the registered callback
         */
        getCallbackId: function() {
            return _id;
        },

        /**
         * Emit change
         * @return {void}
         */
        emitChange: function() {
            this.trigger('change');
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
    }, options);

    // Create instance
    var instance = new constr();

    // If we don't need to register the store
    // automaticly, return the built instance
    if (settings.register !== true) {
        return instance;
    }

    // Register store callback to the application dispatcher
    _id = app.register(instance);

    return instance;
};