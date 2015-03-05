'use strict';

var FFlux = require('../src/index.js');
var chai = require('chai');
var expect = chai.expect;

var toString = Object.prototype.toString;
var noop = function() {};

chai.use(require('chai-spies'));

describe('FFlux mutable store functions', function() {

    var store = new FFlux.MutableStore();

    it('emitChange', function() {
        var spy = chai.spy();

        store.on('change', spy);

        store.emitChange();

        expect(spy).to.have.been.called.once();
    });

    it('getState', function() {
        expect(toString.call(store.getState())).to.be.equal('[object Object]');
    });

    it('setState', function() {
        var spy = chai.spy();

        store.on('change', spy);

        store.setState({
            a: 10,
            b: 20
        });

        expect(store.state.a).to.be.equal(10);
        expect(store.state.b).to.be.equal(20);
        
        expect(spy).to.have.been.called.once();

        store.setState({
            a: 10
        });

        expect(spy).to.have.been.called.twice();
    });

    it('replaceState', function() {
        var spy = chai.spy();

        store.on('change', spy);

        store.replaceState({
            a: 50,
            b: 60
        });

        expect(store.state.a).to.be.equal(50);
        expect(store.state.b).to.be.equal(60);

        expect(spy).to.have.been.called.once(); 
    });

    it('(un)registerAction', function() {
        var actionName = 'STORE_TEST';
        var savedActions = store.getActions();

        // Register action to store
        store.registerAction(actionName, noop);
        
        // Check if the `actions` hash have been changed
        expect(savedActions).not.to.be.equal(store.getActions());

        // You can't re-register existing action
        expect(store.registerAction
            .bind(store, actionName, noop)).to.throw(Error);
            
        // Unregister the action
        store.unregisterAction(actionName);

        // Check if it's back to the default state
        expect(JSON.stringify(savedActions))
            .to.be.equal(JSON.stringify(store.getActions()));
    });
    
});