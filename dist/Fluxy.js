!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Fluxy=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Dispatcher = require('./lib/Dispatcher');
var createStore = require('./lib/StoreFactory');
var createView = require('./lib/ViewFactory');

var NOT_FOUND = -1;

/**
 * Application constructor
 */
var Fluxy = function() {
    var _dispatcher = new Dispatcher();

    /**
     * Create new store
     * @param {options}     Configuration for the store
     * @return {FluxyStore} New instance of the store
     */
    this.createStore = function(options) {
        return createStore.call(this, options);
    };

    /**
     * Create object with action interface
     * @param  {string} type       Type of the action
     * @param  {object} payload    Payload object
     * @return {object}            Object with action interface
     */
    this.createAction = function(type, payload) {
        var action = {
            type: type
        };

        return _.extend(action, payload);
    };

    /**
     * Create new React view
     * @param {options}     Configuration for the view
     * @return {ReactView}  New instance of the view
     */
    this.createView = function(options) {
        return createView.call(this, options);
    };

    /**
     * Dispatcher getter
     * @private
     * @return {Flux.Dispatcher}
     */
    this.getDispatcher = function() {
        return _dispatcher;
    };

    /**
     * Register store to dispatcher
     * @param {FluxyStore} instance     FluxyStore instance
     * @return {string} Registration id
     */
    this.register = function(instance) {
        return _dispatcher.register(function(payload) {
            var type = payload.type;
            var actionKeys = _.keys(instance.actions);

            // Check if we have something to wait for
            // see http://facebook.github.io/flux/docs/dispatcher.html
            // for more details
            if (instance.waitFor.length) {
                _dispatcher.waitFor(instance.waitFor);
            }

            var handler = instance[instance.actions[type]];

            // If we have such actions listener, invoke 
            // related function with payload provided
            if (actionKeys.indexOf(type) !== NOT_FOUND) {
                handler.call(instance, payload);
            }
        });
    };

    /**
     * Unregister store from dispatcher
     * @param {object} options  Binding identificator or store instance
     * @return {void}
     */
    this.unregister = function(options) {
        var id;

        if (typeof options === 'string') {
            id = options;
        } else {
            id = options._id;
        }

        _dispatcher.unregister(id);
    };

    /**
     * Invoke dispatch method of the flux dispatcher's instance
     * @param {object} payload
     * @return true
     */
    this.dispatch = function(payload) {
        var dispatcher = this.getDispatcher();

        dispatcher.dispatch.call(dispatcher, payload);

        return true;
    };
};

module.exports = Fluxy;
},{"./lib/Dispatcher":2,"./lib/StoreFactory":3,"./lib/ViewFactory":4}],2:[function(require,module,exports){
/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Dispatcher
 * @typechecks
 */

"use strict";

var invariant = require('./invariant');

var _lastID = 1;
var _prefix = 'ID_';

/**
 * Dispatcher is used to broadcast payloads to registered callbacks. This is
 * different from generic pub-sub systems in two ways:
 *
 *   1) Callbacks are not subscribed to particular events. Every payload is
 *      dispatched to every registered callback.
 *   2) Callbacks can be deferred in whole or part until other callbacks have
 *      been executed.
 *
 * For example, consider this hypothetical flight destination form, which
 * selects a default city when a country is selected:
 *
 *   var flightDispatcher = new Dispatcher();
 *
 *   // Keeps track of which country is selected
 *   var CountryStore = {country: null};
 *
 *   // Keeps track of which city is selected
 *   var CityStore = {city: null};
 *
 *   // Keeps track of the base flight price of the selected city
 *   var FlightPriceStore = {price: null}
 *
 * When a user changes the selected city, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'city-update',
 *     selectedCity: 'paris'
 *   });
 *
 * This payload is digested by `CityStore`:
 *
 *   flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'city-update') {
 *       CityStore.city = payload.selectedCity;
 *     }
 *   });
 *
 * When the user selects a country, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'country-update',
 *     selectedCountry: 'australia'
 *   });
 *
 * This payload is digested by both stores:
 *
 *    CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       CountryStore.country = payload.selectedCountry;
 *     }
 *   });
 *
 * When the callback to update `CountryStore` is registered, we save a reference
 * to the returned token. Using this token with `waitFor()`, we can guarantee
 * that `CountryStore` is updated before the callback that updates `CityStore`
 * needs to query its data.
 *
 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       // `CountryStore.country` may not be updated.
 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
 *       // `CountryStore.country` is now guaranteed to be updated.
 *
 *       // Select the default city for the new country
 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
 *     }
 *   });
 *
 * The usage of `waitFor()` can be chained, for example:
 *
 *   FlightPriceStore.dispatchToken =
 *     flightDispatcher.register(function(payload) {
 *       switch (payload.actionType) {
 *         case 'country-update':
 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
 *           FlightPriceStore.price =
 *             getFlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *
 *         case 'city-update':
 *           FlightPriceStore.price =
 *             FlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *     }
 *   });
 *
 * The `country-update` payload will be guaranteed to invoke the stores'
 * registered callbacks in order: `CountryStore`, `CityStore`, then
 * `FlightPriceStore`.
 */

    function Dispatcher() {
        this.$Dispatcher_callbacks = {};
        this.$Dispatcher_isPending = {};
        this.$Dispatcher_isHandled = {};
        this.$Dispatcher_isDispatching = false;
        this.$Dispatcher_pendingPayload = null;
    }

    /**
     * Registers a callback to be invoked with every dispatched payload. Returns
     * a token that can be used with `waitFor()`.
     *
     * @param {function} callback
     * @return {string}
     */
    Dispatcher.prototype.register=function(callback) {
        var id = _prefix + _lastID++;
        this.$Dispatcher_callbacks[id] = callback;
        return id;
    };

    /**
     * Removes a callback based on its token.
     *
     * @param {string} id
     */
    Dispatcher.prototype.unregister=function(id) {
        invariant(
            this.$Dispatcher_callbacks[id],
            'Dispatcher.unregister(...): `%s` does not map to a registered callback.',
            id
        );
        delete this.$Dispatcher_callbacks[id];
    };

    /**
     * Waits for the callbacks specified to be invoked before continuing execution
     * of the current callback. This method should only be used by a callback in
     * response to a dispatched payload.
     *
     * @param {array<string>} ids
     */
    Dispatcher.prototype.waitFor=function(ids) {
        invariant(
            this.$Dispatcher_isDispatching,
            'Dispatcher.waitFor(...): Must be invoked while dispatching.'
        );
        for (var ii = 0; ii < ids.length; ii++) {
            var id = ids[ii];
            if (this.$Dispatcher_isPending[id]) {
                invariant(
                    this.$Dispatcher_isHandled[id],
                    'Dispatcher.waitFor(...): Circular dependency detected while ' +
                    'waiting for `%s`.',
                    id
                );
                continue;
            }
            invariant(
                this.$Dispatcher_callbacks[id],
                'Dispatcher.waitFor(...): `%s` does not map to a registered callback.',
                id
            );
            this.$Dispatcher_invokeCallback(id);
        }
    };

    /**
     * Dispatches a payload to all registered callbacks.
     *
     * @param {object} payload
     */
    Dispatcher.prototype.dispatch=function(payload) {
        invariant(!this.$Dispatcher_isDispatching,
            'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.'
        );
        this.$Dispatcher_startDispatching(payload);
        try {
            for (var id in this.$Dispatcher_callbacks) {
                if (this.$Dispatcher_isPending[id]) {
                    continue;
                }
                this.$Dispatcher_invokeCallback(id);
            }
        } finally {
            this.$Dispatcher_stopDispatching();
        }
    };

    /**
     * Is this Dispatcher currently dispatching.
     *
     * @return {boolean}
     */
    Dispatcher.prototype.isDispatching=function() {
        return this.$Dispatcher_isDispatching;
    };

    /**
     * Call the callback stored with the given id. Also do some internal
     * bookkeeping.
     *
     * @param {string} id
     * @internal
     */
    Dispatcher.prototype.$Dispatcher_invokeCallback=function(id) {
        this.$Dispatcher_isPending[id] = true;
        this.$Dispatcher_callbacks[id](this.$Dispatcher_pendingPayload);
        this.$Dispatcher_isHandled[id] = true;
    };

    /**
     * Set up bookkeeping needed when dispatching.
     *
     * @param {object} payload
     * @internal
     */
    Dispatcher.prototype.$Dispatcher_startDispatching=function(payload) {
        for (var id in this.$Dispatcher_callbacks) {
            this.$Dispatcher_isPending[id] = false;
            this.$Dispatcher_isHandled[id] = false;
        }
        this.$Dispatcher_pendingPayload = payload;
        this.$Dispatcher_isDispatching = true;
    };

    /**
     * Clear bookkeeping used for dispatching.
     *
     * @internal
     */
    Dispatcher.prototype.$Dispatcher_stopDispatching=function() {
        this.$Dispatcher_pendingPayload = null;
        this.$Dispatcher_isDispatching = false;
    };


module.exports = Dispatcher;
},{"./invariant":5}],3:[function(require,module,exports){
'use strict';

/**
 * Store factory
 * @param  {object} options         Configuration of the store instance
 * @param {boolean} shouldRegister  Automatic registration flag
 * @return {function} New store instance
 */
module.exports = function(options, shouldRegister) {
    // Simplify the scope usage
    var app = this;
    var _id;

    // If shouldRegister wasn't specified,
    // register by default
    if (shouldRegister === undefined) {
        shouldRegister = true;
    }

    /**
     * Store instance constructor
     */
    var constr = function FluxyStore() {
        this.actions = options.actions || {};
        this.waitFor = options.waitFor || [];
    };

    // Inherit store prototype from bb events and passed options
    _.extend(constr.prototype, Backbone.Events, {
        /**
         * Get registered callback id
         * @return {string} Id of the registered callback
         */
        getCallbackId: function() {
            return _id;
        },

        /**
         * Emit change
         * @return {void}
         */
        emitChange: function() {
            this.trigger('change');
        }
    }, options);

    // Create instance
    var instance = new constr();

    // If we don't need to register the store
    // automaticly, return the built instance
    if (shouldRegister !== true) {
        return instance;
    }

    // Register store callback to the application dispatcher
    _id = app.register(instance);

    return instance;
};
},{}],4:[function(require,module,exports){
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
            if (this.listenTo && this.listenTo.length) {
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
},{}],5:[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (false) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;
},{}]},{},[1])(1)
});