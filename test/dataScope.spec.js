'use strict';

var FFlux = require('../src/index.js');
var chai = require('chai');
var expect = chai.expect;

describe('DataScope', function() {
    var scope = new FFlux.DataScope();

    it('register store at scope', function() {
        var storeA = new FFlux.MutableStore({
            getInitialState: function() {
                return { a: 10 };
            }
        });

        var storeB = new FFlux.MutableStore({
            getInitialState: function() {
                return { b: 20 };
            }
        });

        expect(scope.register.bind(scope, 'storeA', storeA))
            .not.to.throw(Error);
        expect(scope.register.bind(scope, 'storeB', storeB))
            .not.to.throw(Error);
    });

    it('dehydrate & rehydrate data scope', function() {
        var dataString = scope.dehydrate();
        
        var testScope = new FFlux.DataScope();
        testScope.register('storeA', new FFlux.MutableStore());
        testScope.register('storeB', new FFlux.MutableStore());

        testScope.rehydrate(dataString);

        expect(testScope.get('storeA').getState().a).to.be.equal(10);
        expect(testScope.get('storeB').getState().b).to.be.equal(20);
    });

    it('unregister store from scope', function() {
        expect(scope.unregister.bind(scope, 'storeA'))
            .not.to.throw(Error);
    });
});