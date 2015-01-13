'use strict';

var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

/**
 * View factory
 * @param  {object} options React class configuration
 * @return {React.Class}
 */
module.exports = function(options) {

    var defaults = {
        /**
         * Default onChange handler
         * @return {void}
         */
        onChange: function() {
            throw Error('Method onChange must be implemented in the view');
        }
    };

    return React.createClass(_.extend(defaults, options, {
        /**
         * Merge `default` binding mixin with user-specified
         */
        mixins: _.union([FFlux.mixins.binding], options.mixins || [])
    }));
};