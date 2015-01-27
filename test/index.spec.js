'use strict';

var FFlux = require('../src/index.js');
var React = require('react');
var chai = require('chai');
var expect = chai.expect;

describe('FFlux static functions', function() {
    
    it('createDispatcher', function() {
        expect(FFlux.createDispatcher).not.to.throw(Error);
    });

    it('createStore', function() {
        expect(FFlux.createStore).not.to.throw(Error);
    });

    it('mixin\'s bind function', function() {
        var dispatcher = FFlux.createDispatcher();
        var store = FFlux.createStore({
            actions: {
                'TEST': 'test'
            },

            test: function() {
                this.emitChange();
            }
        });

        dispatcher.register(store);

        var spy = chai.spy();

        var viewClass = React.createClass({
            mixins: [FFlux.mixins.bind(store)],

            storeDidUpdate: spy,

            render: function() {
                return React.DOM.div(null, 'something');
            }
        });

        var view = React.createFactory(viewClass)();

        React.renderToString(view);

        dispatcher.dispatch('TEST');

        expect(spy).to.have.been.called.once();
    });
});