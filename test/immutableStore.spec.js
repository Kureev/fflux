'use strict';

var FFlux = require('../src/index.js');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var toString = Object.prototype.toString;
var noop = function() {};

chai.use(require('chai-spies'));

describe('FFlux immutable store functions', function() {

    var store = new FFlux.ImmutableStore();

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

        expect(store.state.get('a')).to.be.equal(10);
        expect(store.state.get('b')).to.be.equal(20);
        
        expect(spy).to.have.been.called.once();

        store.setState({
            a: 10
        });

        expect(spy).to.have.been.called.once();
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