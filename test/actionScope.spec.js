'use strict';

var ActionScope = require('../src/ActionScope');
var Dispatcher = require('../src/Dispatcher');
var MutableStore = require('../src/MutableStore');
var _ = require('../src/helper');
var chai = require('chai');
var expect = chai.expect;

describe('ActionScope', function() {
    var dispatcher = new Dispatcher();
    var actions = new ActionScope(dispatcher);
    var store = new MutableStore();

    dispatcher.register(store);

    var actionCreator = {
        getData: function(dispatch, param) {
            dispatch('GET_DATA', { param: param });
        }
    };

    it('add action creator to the actions', function() {
        expect(
            actions.add.bind(actions, 'action creator', actionCreator)
        ).not.to.throw(Error);

        expect(
            _.isObject(actions.get('action creator'))
        ).to.be.equal(true);

        expect(
            actions.get('action creator')
        ).to.have.property('getData');
    });

    it('invoke registered function without errors', function() {
        var spy = chai.spy();

        store.registerAction('GET_DATA', spy);

        expect(
            actions.get('action creator').getData.bind(null, 'test')
        ).not.to.throw(Error);

        expect(spy).to.have.been.called.once.with({ param: 'test' });
    });

    it('remove action from actions', function() {
        actions.remove('action creator');
        expect(actions.get('action creator')).to.be.equal(null);
    });
});