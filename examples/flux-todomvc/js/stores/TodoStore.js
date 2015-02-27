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

  /**
   * Initial state of the store
   * @return {Object}
   */
  getInitialState: function() {
    return {
      todos: []
    };
  },

  /**
   * Create new todo
   * @param  {Object} payload 
   * @return {Void}         
   */
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

  /**
   * Toggle complete state
   * @return {Void}
   */
  toggleCompleteAll: function() { 
    var areAllComplete = this.areAllComplete();

    this.setState({
      todos: this.state.get('todos').map(function(todoItem) {
        return assign({}, todoItem, {
          complete: !areAllComplete
        });
      })
    });
  },

  /**
   * Mark todo as completed
   * @param  {Object} payload 
   * @return {Void}         
   */
  complete: function(payload) {
    this.updateTodoItem(payload.id, {
      complete: true
    });
  },

  /**
   * Mark todo as uncompleted
   * @param  {Object} payload 
   * @return {Void}         
   */
  uncomplete: function(payload) {
    this.updateTodoItem(payload.id, {
      complete: false
    });
  },

  /**
   * Update todo
   * @param  {Object} payload 
   * @return {Void}         
   */
  updateText: function(payload) {
    this.updateTodoItem(payload.id, payload);
  },

  /**
   * Destroy todo by ID
   * @param  {Object} payload 
   * @return {Void}         
   */
  destroy: function(payload) {
    this.filterTodos(function(todoItem) {
      return todoItem.id !== payload.id;
    });
  },

  /**
   * Destroy completed todos
   * @return {Void} 
   */
  destroyCompleted: function() {
    this.filterTodos(function(todoItem) { 
      return !todoItem.complete;
    });
  },

  /**
   * Filter todos list
   * @param  {Function} filterFunction 
   * @return {Void}                
   */
  filterTodos: function(filterFunction) {
    this.replaceState({
      todos: this.state.get('todos').filter(filterFunction)
    });

    this.emitChange();
  },

  /**
   * Update item by ID
   * @param  {Number} id    
   * @param  {Object} patch 
   * @return {Void}       
   */
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

/*
 * Listen for dispatcher events here
 */
TodoStore.registerAction(TodoConstants.TODO_CREATE, TodoStore.create);
TodoStore.registerAction(TodoConstants.TODO_TOGGLE_COMPLETE_ALL, TodoStore.toggleCompleteAll);
TodoStore.registerAction(TodoConstants.TODO_UNDO_COMPLETE, TodoStore.uncomplete);
TodoStore.registerAction(TodoConstants.TODO_UPDATE_TEXT, TodoStore.updateText);
TodoStore.registerAction(TodoConstants.TODO_COMPLETE, TodoStore.complete);
TodoStore.registerAction(TodoConstants.TODO_DESTROY, TodoStore.destroy);
TodoStore.registerAction(TodoConstants.TODO_DESTROY_COMPLETED, TodoStore.destroyCompleted);

AppDispatcher.register(TodoStore);

module.exports = TodoStore;
