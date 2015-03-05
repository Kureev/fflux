fflux.js 
==========
[![Build Status](https://travis-ci.org/Kureev/fflux.svg?branch=master)](https://travis-ci.org/Kureev/fflux) [![Code Climate](https://codeclimate.com/github/Kureev/fflux/badges/gpa.svg)](https://codeclimate.com/github/Kureev/fflux) [![Test Coverage](https://codeclimate.com/github/Kureev/fflux/badges/coverage.svg)](https://codeclimate.com/github/Kureev/fflux)

Some time ago Facebook engineers released a specification describing [Flux](https://facebook.github.io/flux/) - one-way data flow architecture. After that, they released a Dispatcher constructor, but skipped store, actions and react view/controller-binding parts. In fflux.js I tried to supplement existing code to complete architecture with a tiny layer of the user-friendly API for it.

#### Menu:
* [Installation](#installation)
* [Dispatcher](#dispatcher)
* [Actions](#actions)
* [Action Creators](#action-creators)
* [Stores](#stores)
  * [Mutable Store](#mutable-store)
  * [Immutable Store](#immutable-store)
* [View layer](#view-layer)

## What is FFlux?
* Dispatcher, Store, React mixin + simple API to use them together
* Immutable state in the store (emit "change" event only if data has been really changed)
* 100% test covered code
* "A" class code quality (by @codeclimate)
* Detailed information about errors (by facebook's invariant)
* Very modular: use only those parts that you need

## Installation
#### npm
```shell
npm install fflux
```

#### bower
```shell
bower install fflux
```

## Dispatcher
To create a dispatcher:

```javascript
var dispatcher = new FFlux.Dispatcher();
```

It's very similar with facebook's realization (because it's based on it), but `register` method takes store instance instead of callback function:

```javascript
/**
 * Create store
 * @type {FFluxStore}
 */
var store = new FFlux.MutableStore({ ... });

/**
 * Dispatch action to the system
 */
dispatcher.dispatch('SOME_ACTION', payload);
```

But as you see, nothing happens. The reason is that the store hasn't been registered in the dispatcher:

```javascript
dispatcher.register(store);
```

Now all dispatched events will be available in the action handlers.

## Actions
Actions are used for sending messages from different sources to dispatcher:

```javascript
dispatcher.dispatch('SOME_ACTION', payload);
```

Where `payload` is an usual JS object with event's payload.

## Action Creators
Action Creators usually perform a function of data middleware.
By default it's just a javascript object with functions:

```javascript
var ActionCreatorExample = {
  fetchData: function() {...},
  postData: function() {...},
  ...
};
```

## Stores
Store instances should process and store applicatoin data(**they shouldn't fetch or push data!**).
In fflux, you're able to use mutable and immutable stores. If you want to work with store's state as native javascript object - you should use [mutable stores](#mutable-store). If you prefer immutable structures, [immutable stores](#immutable-store) - that's your choice.

### Mutable Store
Basic mutable store looks like this:

```javascript

var store = new FFlux.MutableStore({
  /**
   * In this property we declare list
   * of the actions we're interested in.
   */
  actions: {
    'SOME_ACTION': 'someMethod'
    'OTHER_ACTION': 'otherActionHandler'
  },

  /**
   * Handler for SOME_ACTION
   * @param {Object} data Payload
   * @return {Void}
   */
  someActionHandler: function(data) {
    this.setState(data);
  },

  /**
   * Handler for OTHER_ACTION
   * @param {Object} data Payload
   * @return {Void}
   */
  otherActionHandler: function(data) {
    this.setState(data);
  }
});
```

In the example above, you have an actions property which provides you a possibility to use declarative style for describing handlers for different action types (looks like backbone's events, huh?). Every handler could be a property of the store instance or independent function. In every action handler you can use `waitFor` method as it's described [here](http://facebook.github.io/flux/docs/dispatcher.html#content):

```javascript
{
  /**
   * Some action's handler
   * @param {Object} data Payload
   * @return {Void}
   *
   * @description For invoke some function(s) only *after* other store
   * process action, we need to use `waitFor` method
   */
  someMethod: function(data) {
    /**
     * If we need to be sure, that some function will be called
     * only after `storage` store would process the action
     */
    dispatcher.waitFor([storage]);
  }
}
```

You can register/unregister action handlers dynamicly after store initialization:

```javascript
var store = new FFlux.MutableStore({...});

/**
 * Action handler function
 * @param {Object} data Payload
 * @return {Void}
 */
function actionHandler(data) {
  //...
}

/**
 * Register handler `actionHandler` for action `SOME_ACTION`
 */
store.registerAction('SOME_ACTION', actionHandler);

/**
 * Call `unregisterAction` for remove action handler
 */
store.unregisterAction('SOME_ACTION');
```

### Immutable store
Immutable stores inherits form [mutable stores](#mutable-store) and enchance thier functionality with [immutable data](http://facebook.github.io/immutable-js/). To explain it on example, let's create some store:

```javascript
var store = new FFlux.ImmutableStore({
  /**
   * Get initial state
   * By default, initial state equals to empty object
   * @return {Object} Initial state
   */
  getInitialState: function() {
    return {};
  }
});
```

At this part we don't see the difference, but let's try to mutate the state:

```javascript
store.setState({
  a: {
    b: {
      c: [1, 2, 3]
    }
  }
});
```

`setState` in the example above will [merge](http://facebook.github.io/immutable-js/docs/#/Map/merge) passed object with existing state. If given state is idential to current state, nothing will happend, otherwise `change` event will occur. Let's take a look how to create a new store state and replace current with a new one:

```javascript
var currentState = store.getState();

/**
 * Mutator for `c` key in `a.b.c` path
 * @param  {Array} element 
 * @return {Immutable.List}
 */
function mutator(element) {
    return element.map(function(i) {
      return i * i;
    });
  }
}

var newState = currentState
  .updateIn(['a', 'b', 'c'], mutator)
  .set('b', 'new key')
  .set('c', currentState.getIn(['a', 'b', 'c']));

store.replaceState(newState);
```

`replaceState` replace your current state with a given one. If given state is idential to current state, nothing will happend, otherwise `change` event will occur.

But if you want more, you can always use full API of [immutable.js](http://facebook.github.io/immutable-js/docs/#/).

## View layer
Flux doesn't have any requirements for the view layer.
For the sake of the simplicity (and package size), I decided not to add any view layer and let programmers decide themselfs what to use. The only thing that fflux.js provides you - it's mixins for auto-binding to the stores:

```javascript
/**
 * Create some immutable store
 */
var store = new FFlux.ImmutableStore({...});

/**
 * React class to describe component
 */
var MyComponentClass = React.createClass({
  /**
   * Bind React view to listen `change` event of the `store`
   * @type {Array}
   */
  mixins: [FFlux.mixins.bind(store)],

  /**
   * After store emit `change` event
   * this function will be invoked
   * @return {Void}
   */
  storeDidUpdate: function() {...},

  render: function() {...}
});

/**
 * That's it, now you can render `MyComponent` and
 * as soon as `store` will emit `change` event, 
 * your component will be redrawn
 */
React.render(<MyComponent />, document.body);
``` 