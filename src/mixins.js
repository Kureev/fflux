'use strict';

var invariant = require('flux/lib/invariant');

module.exports = {
    /**
     * Bind mixin for React views
     * @param  {object} store Store the React view will bind to
     * @return {object}       Mixin for the specified store
     */
    bind: function bind(store) {
        return {
            /**
             * Set `storeDidUpdate` listener to the specified store
             * @return {void}
             */
            componentWillMount: function() {
                invariant(
                    typeof this.storeDidUpdate === 'function',
                    'FFlux bind mixin: You\'re attempting to use ' + 
                    typeof this.storeDidUpdate + ' as a function. ' +
                    'Make sure you defined `storeDidUpdate` function ' + 
                    'in your component and try again.'
                );
                store.addListener('change', this.storeDidUpdate);
            },

            /**
             * Remove all `storeDidUpdate` callbacks from the binded store
             * @return {void}
             */
            componentWillUnmount: function () {
                store.removeListener('change', this.storeDidUpdate);
            }
        };
    }
};