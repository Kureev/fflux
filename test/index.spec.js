'use strict';

var FFlux = require('../src/index.js');
var expect = require('chai').expect;

describe('FFlux static functions', function() {
    
    it('createDispatcher', function() {
        expect(FFlux.createDispatcher).not.to.throw(Error);
    });

    it('createStore', function() {
        expect(FFlux.createStore).not.to.throw(Error);
    });
});