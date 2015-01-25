Getting started
---------------

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
var todoStorage = FFlux.createStore({
    _todos: [],

    actions: {
        'TODO_ADD': 'add',
        'TODO_REMOVE': 'remove',
        'TODO_EDIT': 'edit',
        'TODO_COMPLETE': 'complete',
        'TODO_UNCOMPLETE': 'uncomplete',
        'TODO_SHOW_COMPLETED': 'showCompleted',
        'TODO_SHOW_UNCOMPLETED': 'showUncompleted',
        'TODO_SHOW_ALL': 'showAll'
    }

    ...
});
```

Every store should be responsible for managing and processing all data, which is related to it. To separate scopes of responsibility in this example I use prefixes for all actions (`TODO_`). Now we need to create a handlers for those actions.

```javascript
...

add: function(payload) {
    this._todos.push(payload.todo);
},

remove: function(payload) {
    this._todos.splice(this._todos.indexOf(payload.todo), 1);
},

edit: function(payload) {
    this._todos = this._todos.map(function(todo) {
        if (todo === payload.todo) {
            return payload.editedTodo;
        }

        return todo;
    });
}
```
