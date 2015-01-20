'use strict';

var FFlux = require('../src/index.js');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

chai.use(require('chai-spies'));

describe('FFlux store functions', function() {

    var store = FFlux.createStore();

    it('emitChange', function() {
        var spy = chai.spy();

        store.on('change', spy);

        store.emitChange();

        expect(spy).to.have.been.called.once();
    });

    it('registerAction', function() {
        var handler = function() {};
        var actionName = 'STORE_TEST';

        var savedActions = store.getActions();
        store.registerAction(actionName, handler);

        assert(savedActions !== store.getActions());
    });
    
});