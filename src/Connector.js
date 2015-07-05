'use strict';

var _ = require('./helper');

/**
 * Incapsulate React
 * @param  {Object} React
 * @return {Function}
 */
module.exports = function createConnectorFactory(React) {
    /**
     * Connectors factory
     * @param  {Array} stores Array of stores to subscribe
     * @return {Function}
     */
    return function createConnectFunction(stores) {
        /**
        * Component decorator
        * @param  {React.Element} Component
        * @return {React.Class}
        */
        return function connect(Component) {
            var Connector = React.createClass({
                displayName: 'Connector',
                componentWillMount: function() {
                    var fu = this.enqueueUpdate;
                    stores.forEach(function (store) {
                        store.addListener('change', fu);
                    });
                },

                componentWillUnmount: function() {
                    var fu = this.enqueueUpdate;
                    stores.forEach(function (store) {
                        store.removeListener('change', fu);
                    });
                },

                enqueueUpdate: function() {
                    this.forceUpdate();
                },

                render: function() {
                    return React.createElement(Component, this.props, this.props.children);
                }
            });

            return Connector;
        };
    };
};
