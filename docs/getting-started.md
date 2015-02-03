Getting started
---------------

Screw this, [show me an example](http://github.com/Kureev/fflux-example).

Let's start with developing standart todo-example. First of all we need to create our entry point - `index.html`.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Todo example</title>
    <script type="text/javascript" src="./libs/fflux.min.js"></script>
</head>
<body>
    <script type="text/javascript" src="./src/app.js"></script>
</body>
</html>
```

Nothing new, right? Let's go to the `app.js`. First thing, that we should do - it's to create central application dispatcher. It'll serve as event bus for our application.

```javascript
var dispatcher = FFlux.createDispatcher();
```

Then, we need to create a storage for managing all our todo-data.

```javascript
(function(FFlux) {
    'use strict';

    window.app = {};
    var dispatcher = window.app.dispatcher = FFlux.createDispatcher();

    /*
     * List of the todos
     */
    var todoList = [];

    /*
     * Current todo id
     */
    var currentTodoId = 1;

    /**
     * Get next todo id
     * @return {Number}
     */
    function getNextId() {
        return ++currentTodoId;
    }

    /**
     * Create store
     */
    var storage = window.app.storage = FFlux.createStore({
        /**
         * Actions, binded to store
         * @type {Object}
         */
        actions: {
            'TODO_ADD': 'add',
            'TODO_REMOVE': 'remove'
        },

        /**
         * Get list of todos
         * @return {Array} Array of todos
         */
        getTodoList: function() {
            return todoList;
        },

        /**
         * Add new todo in the list
         * @param {Object} payload
         */
        add: function(payload) {
            todoList.push({
                id: getNextId(),
                text: payload.text,
                complete: false
            });

            this.emitChange();
        },

        /**
         * Remove todo from the list
         * @param {Object} payload
         */
        remove: function(payload) {
            todoList = todoList.filter(function(todo) {
                return todo.id !== payload.id;
            });
            this.emitChange();
        }
    });

    /*
     * Register storage at dispatcher
     */
    dispatcher.register(storage);

})(window.FFlux);
```

Every store should be responsible for managing and processing all data, which is related to it. To separate scopes  in this example I use prefixes for all actions (`TODO_`). If a value for the key is a string, it'll try to invoke an appropriate method of the instance, otherwise it'll try to invoke a passed function. 

Now let's take a look on our React components. Our layout will looks like this:

```javascript
/**
 * Generate TodoItem
 * @param  {Object} todo Todo list item data
 * @return {React.DOM}
 */
function generateTodoItem(todo) {
    return (
        <TodoItem 
            key={todo.id} 
            id={todo.id}
            todo={todo.text}
        />
    );
}

var TodoList = React.createClass({
    displayName: 'TodoList',

    /**
     * Bind React view to listen `change` event of the `store`
     * @type {Array}
     */
    mixins: [FFlux.mixins.bind(storage)],

    /**
     * After store emit `change` event
     * this function will be invoked
     * @return {void}
     */
    storeDidUpdate: function() {
        this.forceUpdate();
    },

    /**
     * Get list of todos
     * @return {Array}
     */
    getTodos: function() {
        return storage.getTodoList();
    },

    render: function() {
        return (
            <div>
                <TodoInput />
                <ul>{ this.getTodos().map(generateTodoItem) }</ul>
            </div>
        );
    }
});
```

As you can see, we compose it from <TodoInput/> component and list of <TodoItem/>. Let's start from <TodoItem/>:

```javascript
var TodoItem = React.createClass({
    displayName: 'TodoItem',

    /**
     * Remove link handler
     * @return {Void}
     */
    _remove: function() {
        TodoActions.removeTodo(this.props.id);
    },

    render: function() {
        return (
            <li key={this.props.id}>
                <span>{this.props.todo} </span>
                <a href="#" onClick={this._remove}>remove</a>
            </li>
        );
    }
});
```

As you see, we call for `TodoActions` object method for removing todo item. That's how we use `ActionCreators`.
So, the last component we need to create - it's a <TodoInput/>:

```javascript
/**
 * Constant for ENTER key
 * @type {Number}
 */
var ENTER_KEY_CODE = 13;

var TodoInput = React.createClass({
    /*
     * If user pressed ENTER key - save todo
     */
    _onKeyDown: function() {
        if (event.keyCode === ENTER_KEY_CODE) {
            this._save();
        }
    },

    /**
     * On every input in the field set new state
     * @return {Void}
     */
    _onChange: function() {
        this.setState({
            value: event.target.value
        });
    },

    /**
     * Save todo
     * @return {Void}
     */
    _save: function() {
        TodoActions.addTodo(this.state.value);
        this.setState({
            value: ''
        });
    },

    /**
     * Get initial state of the input
     * @return {Object}
     */
    getInitialState: function() {
        return {
            value: this.props.value || ''
        };
    },

    render: function() {
        return (
            <input
                type="text"
                id="todo-text"
                value={this.state.value}
                onChange={this._onChange}
                onKeyDown={this._onKeyDown}
            />
        );
    }
});
```

We already mentioned, that as data manipulation layer we use `ActionCreators`, so it's time to create them:

```javascript
window.app.actions = {
    /**
     * Add todo
     * @param {String} text
     */
    addTodo: function(text) {
        if (!text.length) {
            window.alert('No todo message');
            return false;
        }

        dispatcher.dispatch('TODO_ADD', {
            text: text
        });
    },

    /**
     * Remove todo
     * @param  {Number} id 
     * @return {Void}
     */
    removeTodo: function(id) {
        dispatcher.dispatch('TODO_REMOVE', {
            id: id
        });
    }
};
```

Of course, if you want to take a look on the example code, you can find it [here](http://github.com/Kureev/fflux-example).