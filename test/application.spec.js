'use strict';

var Application = require('../src/Application');
var MutableStore = require('../src/MutableStore');
var _ = require('../src/helper');
var chai = require('chai');

var expect = chai.expect;

describe('Application', function() {
    var noop = function(){};
    var app = new Application({
        stores: {
            'someStore': new MutableStore()
        },
        actions: {
            some: {
                action: noop
            }
        }
    });

    it('return a dispatcher', function() {
        expect(_.isObject(app.dispatcher())).to.be.equal(true);
    });

    it('return action creators', function() {
        expect(_.isObject(app.actions())).to.be.equal(true);
    });

    it('return `some` action creater', function() {
        expect(_.isObject(app.actions('some'))).to.be.equal(true);
    });

    it('return stores', function() {
        expect(_.isObject(app.stores())).to.be.equal(true);
    });

    it('return `some` store', function() {
        expect(_.isObject(app.stores('someStore'))).to.be.equal(true);
    });

});