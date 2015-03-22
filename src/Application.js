'use strict';

var Dispatcher = require('./Dispatcher');
var DataScope = require('./DataScope');
var ActionScope = require('./ActionScope');

function Application() {
    this._dispatcher = new Dispatcher();
    
    this._dataScope = new DataScope({
        dispatcher: this._dispatcher
    });

    this._actionScope = new ActionScope({
        dispatcher: this._dispatcher
    });
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