'use strict';

var ImmutableStore = require('../src/ImmutableStore');
var chai = require('chai');
var expect = chai.expect;

var toString = Object.prototype.toString;
var noop = function() {};

chai.use(require('chai-spies'));

describe('FFlux immutable store functions', function() {

    var store = new ImmutableStore();

    it('_updateState', function() {
        var state = store.getState();

        var spy = chai.spy();

        store.on('change', spy);

        store._updateState(state.merge({ a: 11 }));

        expect(store.getState().get('a')).to.be.equal(11);
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

        var state = store.getState();

        expect(state.get('a')).to.be.equal(10);
        expect(state.get('b')).to.be.equal(20);
        
        expect(spy).to.have.been.called.once();

        store.setState({
            a: 10
        });

        expect(spy).to.have.been.called.once();
    });

    it('dehydrate & rehydrate', function() {
        store.replaceState({
            a: 1,
            b: 2
        });

        var dataString = store.dehydrate();

        var testStore = new ImmutableStore();
        testStore.rehydrate(dataString);

        var oldState = store.getState();
        var newState = testStore.getState();

        expect(newState.a).to.be.equal(oldState.a);
        expect(newState.b).to.be.equal(oldState.b);
    });

    it('replaceState', function() {
        var spy = chai.spy();

        store.on('change', spy);

        store.replaceState({
            a: 50,
            b: 60
        });

        expect(store.state.get('a')).to.be.equal(50);
        expect(store.state.get('b')).to.be.equal(60);

        expect(spy).to.have.been.called.once(); 
    });
    
});