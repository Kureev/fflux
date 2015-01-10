'use strict';

/**
 * View factory
 * @param  {object} options React class configuration
 * @return {React.Class}
 */
module.exports = function(options) {
    var defaults = {
        render: function() {
            
        }
    };

    return React.createClass(_.extend(defaults, options, {
        componentDidMount: function() {
            if (typeof this.listenTo === 'object') {
                this.listenTo.on('change', this.onChange);
            } else if (this.listenTo && this.listenTo.length) {
                for (var i = 0; i < this.listenTo.length; i++) {
                    this.listenTo[i].on('change', this.onChange);
                }
            }

            if (options.componentDidMount) {
                options.componentDidMount.call(this);
            }
        },

        componentWillUnmount: function () {
            if (options.componentWillUnmount) {
                options.componentWillUnmount.call(this);
            }  
        },

        onChange: function() {
            if (!options.onChange) {
                throw Error('onChange must be implemented in the view');
            } else {
                options.onChange.call(this);
            }
        }
    }));
};