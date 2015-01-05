'use strict';

var defaultActions = {};

module.exports = function(options) {

    var constr = function FluxyStore() {
        this.actions = _.extend(defaultActions, options.actions || {});
    };

    _.extend(constr.prototype, Backbone.Events, options);

    var instance = new constr();

    // Register store callback to the application dispatcher
    this.dispatcher.register(function(payload) {
        var action = payload.action;

        var actionKeys = _.keys(instance.actions);

        if (~actionKeys.indexOf(action.actionName)) {
            instance.actions[action.actionName].call(instance, payload);
        }
    });

    return instance;
};