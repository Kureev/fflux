'use strict';

var DataScope = require('../src/DataScope');
var MutableStore = require('../src/MutableStore');
var Dispatcher = require('../src/Dispatcher');
var _ = require('../src/helper');
var chai = require('chai');
var expect = chai.expect;

describe('DataScope', function() {
    var dispatcher = new Dispatcher();
    var scope = new DataScope(dispatcher);

    it('register store at scope', function() {
        var storeA = new MutableStore({
            getInitialState: function() {
                return { a: 10 };
            }
        });

        var storeB = new MutableStore({
            getInitialState: function() {
                return { b: 20 };
            }
        });

        expect(scope.register.bind(scope, 'storeA', storeA))
            .not.to.throw(Error);
        expect(scope.register.bind(scope, 'storeB', storeB))
            .not.to.throw(Error);
    });

    it('should return object with stores', function() {
        expect(_.isObject(scope.getAll())).to.be.equal(true);
    });

    it('dehydrate & rehydrate data scope', function() {
        var dataString = scope.dehydrate();
        var testScope = new DataScope(dispatcher);
        
        testScope.register('storeA', new MutableStore());
        testScope.register('storeB', new MutableStore());

        testScope.rehydrate(dataString);

        expect(testScope.get('storeA').getState().a).to.be.equal(10);
        expect(testScope.get('storeB').getState().b).to.be.equal(20);
    });

    it('unregister store from scope', function() {
        expect(scope.unregister.bind(scope, 'storeA'))
            .not.to.throw(Error);
    });
});