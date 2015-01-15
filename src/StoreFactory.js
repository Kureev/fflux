'use strict';

var _ = require('./helper');
var EventEmitter = require('events')
    .EventEmitter;

/**
 * Store factory
 * @param  {string}     name                Name of the store
 * @param  {object}     options             Configuration of the store instance
 * @param  {object}     settings            Extra settings for the store
 * @return {function}   New store instance
 */
module.exports = function(name, options, settings) {
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

    // Inherit store prototype from event emitter and passed options
    _.extend(constr.prototype, EventEmitter.prototype, {
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
    }, options);

    // Create instance
    var instance = new constr();

    // If we don't need to register the store
    // automaticly, return the built instance
    if (settings.register !== true) {
        return instance;
    }

    // Register store callback to the application dispatоcher
    _id = app.register(instance);

    app._stores = app._stores || {};

    if (!app._stores[name]) {
        app._stores[name] = instance;
    } else {
        throw Error('Store with those name is already exists');
    }

    return instance;
};