'use strict';

var Dispatcher = require('../src/Dispatcher');
var MutableStore = require('../src/MutableStore');
var chai = require('chai');
var expect = chai.expect;

chai.use(require('chai-spies'));

describe('FFlux dispatcher functions', function() {

    var dispatcher = new Dispatcher();
    var store1 = new MutableStore();
    var store2 = new MutableStore();

    // Test data
    var actionName = 'DISPATCH_TEST';
    var payload = { key: 'value' };

    it('dispatch', function() {
        dispatcher.register(store1);
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

        dispatcher.unregister(store1);
    });

    it('register', function() {
        expect(dispatcher.register.bind(dispatcher, store1))
            .not.to.throw(Error);
    });

    it('unregister', function() {
        expect(dispatcher.unregister.bind(dispatcher, store1))
            .not.to.throw(Error);
    });

    it('waitFor', function() {
        dispatcher.register(store2);
        dispatcher.register(store1);

        function normalHandler(payload) {
            store1.setState(payload);
        }

        function waitingHandler(payload) {
            dispatcher.waitFor([store1]);

            store2.setState({
                dataFromStore1: store1.getState(),
                myOwnData: payload
            });
        }

        // Create 2 spies for 2 stores: sync and async
        var normalSpy = chai.spy(normalHandler);
        var waitingSpy = chai.spy(waitingHandler);

        // Register those spies as action handlers
        store1.registerAction(actionName, normalSpy);
        store2.registerAction(actionName, waitingSpy);

        dispatcher.dispatch(actionName, payload);

        // Smoke-test
        expect(normalSpy).to.have.been.called.once.with(payload);
        expect(waitingSpy).to.have.been.called.once.with(payload);

        // Check if we got our waitFor condition work correct
        expect(JSON.stringify(store2.getState().dataFromStore1))
            .to.be.equal(JSON.stringify(store1.getState()));

        dispatcher.unregister(store1);
        dispatcher.unregister(store2);
    });
});