'use strict';

var _ = require('./helpers');

/**
 * Incapsulate React
 * @param  {Object} React
 * @return {Function}
 */
module.exports = function createConnectConstructor(React) {
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
      return React.createClass({
        componentWillMount: function() {
          stores.forEach((store) =>
            store.addListener('change', this.forceUpdate))
        },

        componentWillUnmount: function() {
          stores.forEach((store) =>
            store.removeListener('change', this.forceUpdate))
        },

        render: function() {
          return React.cloneElement(Component, this.props);
        }
      });
    }
  };
}
