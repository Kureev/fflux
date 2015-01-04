'use strict';

var Fluxy = function() {};
Fluxy.Dispatcher = require('./lib/Dispatcher');
Fluxy.createStore = require('./lib/StoreFactory');

module.exports = Fluxy;