'use strict';

var Application = require('../src/Application');
var _ = require('../src/helper');
var chai = require('chai');

var expect = chai.expect;

describe('Application', function() {
    var app = new Application();

    it('return a dispatcher', function() {
        expect(_.isObject(app.dispatcher())).to.be.equal(true);
    });

    it('return action creators', function() {
        expect(_.isObject(app.actions())).to.be.equal(true);
    });

    it('return stores', function() {
        expect(_.isObject(app.stores())).to.be.equal(true);
    });
});