(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _ = require('./src/helper');
var createStore = require('./src/Store');
var createDispatcher = require('./src/Dispatcher');

/**
 * Application constructor
 */
var FFlux = FFlux || {};

FFlux.createDispatcher = function() {
    return createDispatcher.call(null);
}

/**
 * Create new store
 * @param {object}      options     Configuration for the store
 * @return {FFluxStore} New instance of the store
 */
FFlux.createStore = function(options) {
    return createStore.call(null, options);
};

/**
 * Create object with action interface
 * @param  {string} type    Type of the action
 * @param  {object} data    Payload object
 * @return {object}         Object with action interface
 */
FFlux.createAction = function(type, data) {
    return {
        type: type,
        data: data
    };
};

FFlux.mixins = {};

FFlux.mixins.binding = {
    /**
     * Set `storeDidUpdate` listener to `listenTo` store(s)
     * @return {void}
     */
    componentDidMount: function() {
        if (_.isArray(this.listenTo) && this.listenTo.length) {
            for (var i = 0; i < this.listenTo.length; i++) {
                if (_.isObject(this.listenTo[i])) {
                    this.listenTo[i].addListener('change', this.storeDidUpdate);
                } else {
                    this.getStore(this.listenTo[i]).addListener('change', this.storeDidUpdate);
                }
            }
        } else {
            this.listenTo.addListener('change', this.storeDidUpdate);
        }
    },

    /**
     * Remove all `storeDidUpdate` callbacks from binded stores
     * @return {void}
     */
    componentWillUnmount: function () {
        if (_.isArray(this.listenTo) && this.listenTo.length) {
            for (var i = 0; i < this.listenTo.length; i++) {
                if (_.isObject(this.listenTo[i])) {
                    this.listenTo[i].removeListener('change', this.storeDidUpdate);
                } else {
                    this.getStore(this.listenTo[i]).removeListener('change', this.storeDidUpdate);    
                }
            }
        } else {
            this.listenTo.removeListener('change', this.storeDidUpdate);
        }
    }
};

window.FFlux = FFlux;
},{"./src/Dispatcher":3,"./src/Store":4,"./src/helper":5}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],3:[function(require,module,exports){
'use strict';

var Dispatcher = require('./vendor/Dispatcher');
var _ = require('./helper');

function FFluxDispatcher() {
    /**
     * Create facebook's dispatcher realization
     * @type {Dispatcher}
     */
    this._dispatcher = new Dispatcher();
    /**
     * Invoke dispatch method of the flux dispatcher's instance
     * @param {object} payload
     * @return true
     */
    this.dispatch = function(action) {
        this._dispatcher.dispatch.call(this._dispatcher, action);
    };
    
    /**
     * Bridge to dispatcher's waitFor
     * @param {array} arrayOfStores Array of stores to wait for
     */
    this.waitFor = function(arrayOfStores) {
        this._dispatcher.waitFor.call(this._dispatcher, arrayOfStores);
    };
}

_.extend(FFluxDispatcher.prototype, {
    /**
     * Register store to dispatcher
     * @param {FFluxStore} instance     FFluxStore instance
     * @return {string} Registration id
     */
    register: function(instance) {
        return this._dispatcher.register(function(action) {
            var type = action.type;
            var handler;
            // Get array of registered actions
            var actionKeys = _.keys(instance.actions);

            // If we have such actions listener(s), invoke 
            // related function with action provided
            actionKeys.forEach(function(key) {
                if (key === type) {
                    switch (typeof instance.actions[type]) {
                        case 'string':
                            handler = instance[instance.actions[type]];
                            break;
                        case 'function':
                            handler = instance.actions[type];
                            break;
                        default:
                            throw Error('You must specify handler for action ' + type);
                    }
                    
                    handler.call(instance, action.data);
                }
            });
        });
    },

    /**
     * Unregister store from dispatcher
     * @param {object} options  Binding identificator or store instance
     * @return {void}
     */
    unregister: function(options) {
        var id;

        if (typeof options === 'string') {
            id = options;
        } else {
            id = options._id;
        }

        this._dispatcher.unregister(id);
    }
});

module.exports = function() {
    return new FFluxDispatcher();
};
},{"./helper":5,"./vendor/Dispatcher":6}],4:[function(require,module,exports){
'use strict';

var _ = require('./helper');
var EventEmitter = require('events').EventEmitter;

/**
 * Store instance constructor
 */
function FFluxStore(options) {
    _.extend(this, options);
};

/**
 * Inherit store prototype from event emitter and passed options
 */
_.extend(FFluxStore.prototype, EventEmitter.prototype, {
    /**
     * Emit change
     * @return {void}
     */
    emitChange: function() {
        this.emit('change');
    },

    /**
     * Register action's handler
     * @param  {string} action  Action's name
     * @param  {function} handler Aciont's handler
     * @return {void}
     */
    registerAction: function(action, handler) {
        if (this.actions[action]) {
            throw Error('You can\'t override existing handler. Unregister it first!');
        }

        this.actions[action] = handler;
    },

    /**
     * Unregister action's handler from store
     * @param  {string} action Action name
     * @return {void}
     */
    unregisterAction: function(action) {
        if (this.actions[action]) {
            delete this.actions[action];
        } else {
            throw Error('You have no handlers for action ' + action);
        }
    }
});

/**
 * Store factory
 * @param  {object}     options             Configuration of the store instance
 * @return {function}   New store instance
 */
module.exports = function(options) {
    return new FFluxStore(options);
}
},{"./helper":5,"events":2}],5:[function(require,module,exports){
'use strict';

function isObject(param) {
    return Object.prototype.toString.call(param) === '[object Object]';  
}

function isArray(param) {
    return Object.prototype.toString.call(param) === '[object Array]';
}

function keys(obj) {
    return Object.keys(obj);
}

function extend(obj) {
    if (!isObject(obj)) {
        return obj;
    }

    var source, prop;

    for (var i = 1, length = arguments.length; i < length; i++) {
        source = arguments[i];
        for (prop in source) {
            if (Object.hasOwnProperty.call(source, prop)) {
                obj[prop] = source[prop];
            }
        }
    }

    return obj;
}

module.exports = {
    keys: keys,
    isArray: isArray,
    isObject: isObject,
    extend: extend
};
},{}],6:[function(require,module,exports){
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
},{"./invariant":7}],7:[function(require,module,exports){
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
},{}]},{},[1]);
