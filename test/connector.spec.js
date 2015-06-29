'use strict';

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var createConnector = require('../src/Connector')(React);
var MutableStore = require('../src/MutableStore');
var chai = require('chai');
var expect = chai.expect;
var jsdom = require("jsdom").jsdom;

var store = new MutableStore();

global.document = jsdom();
global.window = global.document.defaultView;

describe('Store connector', function() {
    it ('works', function() {
        var hitRender = chai.spy();
        var connector = createConnector([store]);
        var View = React.createClass({
            render: function() {
                hitRender();
                return React.DOM.div(null, this.props.value);
            }
        });

        var DecoratedElement = React.createFactory(connector(View));

        expect(TestUtils.isElement(DecoratedElement())).to.be.true();
        TestUtils.renderIntoDocument(DecoratedElement());
        expect(hitRender).to.have.been.called.exactly(1);
        store.emitChange();
        expect(hitRender).to.have.been.called.exactly(2);
    });
});
