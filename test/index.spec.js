'use strict';

var assert = require('assert');
var FFlux = require('../index.js');

describe('FFlux static functions', function() {
    
    it('createDispatcher', function() {
        var dispatcher = FFlux.createDispatcher();
    });

    it('createStore', function() {
        var store = FFlux.createStore();
    });
});