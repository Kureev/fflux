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

    it('setState', function() {
        var spy = chai.spy();

        store.on('change', spy);

        store.setState({
            a: 10,
            b: 20
        });

        expect(store.state.get('a')).to.be.equal(10);
        expect(store.state.get('b')).to.be.equal(20);
        
        expect(spy).to.have.been.called.once();

        store.setState({
            a: 10
        });

        expect(spy).to.have.been.called.once();
    });

    it('toJSON', function() {
        expect(Object.prototype.toString.call(store.toJSON())).to.be.equal('[object Object]');
    });

    it('(un)registerAction', function() {
        var actionName = 'STORE_TEST';
        var savedActions = store.getActions();

        // Register action to store
        store.registerAction(actionName, function() {});
        // Check if the `actions` hash have been changed
        assert(savedActions !== store.getActions());

        // You can't re-register existing action
        expect(store.registerAction.bind(store, actionName, function() {})).to.throw(Error);
            
        // Unregister the action
        store.unregisterAction(actionName);

        // You can't unregister non-existing action
        expect(store.unregisterAction.bind(store, actionName)).to.throw(Error);
        // Check if it's back to the default state
        assert(JSON.stringify(savedActions) === JSON.stringify(store.getActions()));
    });
    
});