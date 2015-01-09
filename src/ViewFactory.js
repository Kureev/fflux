'use strict';

/**
 * View factory
 * @param  {object} options React class configuration
 * @return {React.Class}
 */
module.exports = function(options) {
    var defaults = {};

    return React.createClass(_.extend(defaults, options));
};