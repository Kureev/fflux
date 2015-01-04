'use strict';

var defaultActions = {};

module.exports = function(options) {

    var constr = function FluxyStore() {
        this.actions = _.extend(defaultActions, options.actions || {});
    };

    _.extend(constr.prototype, Backbone.Events, options);

    return new constr();
};