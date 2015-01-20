'use strict';

var FFlux = require('../src/index.js');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

chai.use(require('chai-spies'));

describe('FFlux dispatcher', function() {

    beforeEach(function() {
        dispatcher.register(store1);
        dispatcher.register(store2);
    });

    afterEach(function() {
        dispatcher.unregister(store1);
        dispatcher.unregister(store2);
    });

    var dispatcher = FFlux.createDispatcher();
    var store1 = FFlux.createStore({
        getData: function() { return this._data; }
    });
    var store2 = FFlux.createStore({
        getData: function() { return this._data; }
    });

    // Test data
    var actionName = 'DISPATCH_TEST';
    var payload = { key: 'value' };

    it('dispatch', function() {
        // Create spy for handler function
        var spy = chai.spy();

        // Use this spy as handler for our test action
        store1.registerAction(actionName, spy);

        // Dispatch it
        dispatcher.dispatch(actionName, payload);

        // And check if it has been called once with specified payload
        expect(spy).to.have.been.called.once.with(payload);

        // After test we should remove custom action handler
        store1.unregisterAction(actionName);
    });

    it('waitFor', function() {
        function normalHandler(payload) {
            this._data = payload;
        }

        function waitingHandler(payload) {
            dispatcher.waitFor([store1]);

            this._data = {
                dataFromStore1: store1.getData(),
                myOwnData: payload
            };
        }

        // Create 2 spies for 2 stores: sync and async
        var normalSpy = chai.spy(normalHandler)
        var waitingSpy = chai.spy(waitingHandler);

        // Register those spies as action handlers
        store1.registerAction(actionName, normalSpy);
        store2.registerAction(actionName, waitingSpy);

        dispatcher.dispatch(actionName, payload);

        // Smoke-test
        expect(normalSpy).to.have.been.called.once.with(payload);
        expect(waitingSpy).to.have.been.called.once.with(payload);

        // Check if we got our waitFor condition work correct
        assert(store2.getData().dataFromStore1 === store1.getData());
    });
});