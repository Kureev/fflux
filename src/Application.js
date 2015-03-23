'use strict';

var Dispatcher = require('./Dispatcher');
var DataScope = require('./DataScope');
var ActionScope = require('./ActionScope');

function Application(data) {
    var dispatcher = new Dispatcher();
    
    this._dispatcher = dispatcher;
    this._dataScope = new DataScope(dispatcher);
    this._actionScope = new ActionScope(dispatcher);

    if (data) {
        DataScope.rehydrate(data);
    }
}

Application.prototype = {
    dispatcher: function() {
        return this._dispatcher;
    },

    stores: function() {
        return this._dataScope;
    },

    actions: function() {
        return this._actionScope;
    }
};

module.exports = Application;