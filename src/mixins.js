'use strict';

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