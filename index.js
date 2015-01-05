'use strict';

var Dispatcher = require('./lib/Dispatcher');
var createStore = require('./lib/StoreFactory');

var Fluxy = function() {
    this.dispatcher = new Dispatcher();
    this.createStore = createStore;
};

module.exports = Fluxy;