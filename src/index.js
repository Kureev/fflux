'use strict';

var FFlux = FFlux || {};

FFlux.createDispatcher = require('./Dispatcher');
FFlux.createStore = require('./Store');
FFlux.mixins = require('./mixins');

if (process.browser) {
    window.FFlux = FFlux;
}

module.exports = FFlux;