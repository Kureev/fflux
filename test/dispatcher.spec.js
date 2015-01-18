'use strict';

var FFlux = require('../index.js');
var assert = require('assert');

describe('FFlux dispatcher', function() {

    var dispatcher = FFlux.createDispatcher();
    var store2 = FFlux.createStore({
        actions: {
            'TEST': 'test'
        },

        test: function(payload) {
            this._data = payload;
            this.emitChange();
        },

        getData: function() {
            return this._data;
        }
    });

    var store = FFlux.createStore({
        actions: {
            'TEST': 'test'
        },

        test: function() {
            dispatcher.waitFor([store2]);
            this._data = store2.getData();
            this.emitChange();
        },

        getData: function() {
            return this._data;
        }
    });
    
    it('register store', function() {
        dispatcher.register(store);
    });

    it('unregister store', function() {
        dispatcher.unregister(store);
    });

    it('dispatch', function() {
        dispatcher.dispatch('TEST', {
            key: 'value'
        });
    });

    it('waitFor', function(done) {
        dispatcher.register(store);
        dispatcher.register(store2);

        store.addListener('change', function() {
            assert.equal(this.getData().key, 'value');
            done();
        });

        dispatcher.dispatch('TEST', {
            key: 'value'
        });
    });
});