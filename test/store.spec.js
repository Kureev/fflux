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

    it('(un)registerAction', function() {
        var handler = function() {};
        var actionName = 'STORE_TEST';
        var savedActions = store.getActions();

        // Register action to store
        store.registerAction(actionName, handler);
        // Check if the `actions` hash have been changed
        assert(savedActions !== store.getActions());

        // Unregister the action
        store.unregisterAction(actionName);
        // Check if it's back to the default state
        assert(JSON.stringify(savedActions) == JSON.stringify(store.getActions()));
    });
    
});