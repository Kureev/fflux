/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoStore
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var FFlux = require('fflux');
var assign = require('object-assign');
var TodoConstants = require('../constants/TodoConstants');

function getNewRecordID() {
  return (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
}

var TodoStore = new FFlux.Store({

  getInitialState: function() {
    return {
      todos: []
    };
  },

  create: function(payload) {
    var text = payload.text.trim();
    if (text !== '') {
      this.setState({
        todos: this.state.get('todos').push({
          id: getNewRecordID(),
          complete: false,
          text: text
        })
      });

      window.todos = this.state.get('todos');
    }
  },
  /**
   * Tests whether all the remaining TODO items are marked as completed.
   * @return {boolean}
   */
  areAllComplete: function() {
    return this.state.get('todos').every(function(todoItem) {
      return todoItem.complete;
    });
  },

  toggleCompleteAll: function() {
    var currentState = this.areAllComplete();
    
    this.updateAll({
      complete: !currentState
    });
  },

  updateAll: function(patch) {
    this.setState({
      todos: this.state.get('todos').map(function(todoItem) {
        return assign({}, todoItem, patch);
      })
    });
  },

  complete: function(payload) {
    this.updateTodoItem(payload.id, {
      complete: true
    });
  },

  uncomplete: function(payload) {
    this.updateTodoItem(payload.id, {
      complete: false
    });
  },

  updateText: function(payload) {
    this.updateTodoItem(payload.id, payload);
  },

  destroy: function(payload) {
    this.filterTodos(function(todoItem) {
      return todoItem.id !== payload.id;
    });
  },

  destroyCompleted: function() {
    this.filterTodos(function(todoItem) { 
      return !todoItem.complete;
    });
  },

  filterTodos: function(filterFunction) {
    this.replaceState({
      todos: this.state.get('todos').filter(filterFunction)
    });

    this.emitChange();
  },

  updateTodoItem: function(id, patch) {
    this.setState({
      todos: this.state.get('todos').map(function(todoItem) {
        if (todoItem.id === id) {
          return assign({}, todoItem, patch);
        }

        return todoItem;
      })
    });
  },

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function() {
    var all = {};
    this.state.get('todos').map(function(todoItem) {
      all[todoItem.id] = todoItem;
    });

    return all;
  }
});

TodoStore.registerAction(TodoConstants.TODO_CREATE, TodoStore.create);
TodoStore.registerAction(TodoConstants.TODO_TOGGLE_COMPLETE_ALL, TodoStore.toggleCompleteAll);
TodoStore.registerAction(TodoConstants.TODO_UNDO_COMPLETE, TodoStore.uncomplete);
TodoStore.registerAction(TodoConstants.TODO_UPDATE_TEXT, TodoStore.updateText);
TodoStore.registerAction(TodoConstants.TODO_COMPLETE, TodoStore.complete);
TodoStore.registerAction(TodoConstants.TODO_DESTROY, TodoStore.destroy);
TodoStore.registerAction(TodoConstants.TODO_DESTROY_COMPLETED, TodoStore.destroyCompleted);

AppDispatcher.register(TodoStore);

module.exports = TodoStore;
