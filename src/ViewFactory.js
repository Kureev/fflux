'use strict';

/**
 * View factory
 * @param  {object} options React class configuration
 * @return {React.Class}
 */
module.exports = function(options) {

    var defaults = {
        render: function() {
            throw Error('Method render must be implemented in the view');
        },

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
         * Default componentDidMount behaviour
         * @return {void}
         */
        componentDidMount: function() {
            if (_.isArray(this.listenTo) && this.listenTo.length) {
                for (var i = 0; i < this.listenTo.length; i++) {
                    this.listenTo[i].on('change', this.onChange);
                }
            } else {
                this.listenTo.on('change', this.onChange);
            }

            if (options.componentDidMount) {
                options.componentDidMount.call(this);
            }
        },

        /**
         * Default componentWillUnmount behaviour
         * @return {void}
         */
        componentWillUnmount: function () {
            if (options.componentWillUnmount) {
                options.componentWillUnmount.call(this);
            }  
        }
    }));
};