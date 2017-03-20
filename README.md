fflux.js [deprecated, use redux instead]
==========

[![Greenkeeper badge](https://badges.greenkeeper.io/Kureev/fflux.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/Kureev/fflux.svg?branch=master)](https://travis-ci.org/Kureev/fflux) [![Code Climate](https://codeclimate.com/github/Kureev/fflux/badges/gpa.svg)](https://codeclimate.com/github/Kureev/fflux) [![Test Coverage](https://codeclimate.com/github/Kureev/fflux/badges/coverage.svg)](https://codeclimate.com/github/Kureev/fflux)

#### Contents:
* [What is FFlux?](#what-is-fflux)
* [Examples](#examples)
* [Roadmap](#roadmap)
* [Installation](#installation)
* [Application](#application)
* [Dispatcher](#dispatcher)
  * [Dispatcher API](#dispatcher-api)
* [Action Creators](#action-creators)
* [Action Scope](#action-scope)
  * [Action Scope API](#action-scope-api)
* [Stores](#stores)
  * [Store API](#store-api)
  * [Mutable Store](#mutable-store)
  * [Immutable Store](#immutable-store)
* [Data Scope](#data-scope)
  * [Data Scope API](#data-scope-api)
* [View layer](#view-layer)

#### Examples:
* [TODO list](https://github.com/Kureev/fflux/tree/master/examples/flux-todomvc)
* [FFlux isomorphic application (work in progress)](https://github.com/Kureev/fflux-isomorphic-example)

## What is FFlux?
* Simple way to use flux architecture
* Minimum API
* Two types of stores: [mutable](#mutable-store) & [immutable](#immutable-store)
* Isomorphic friendly (no singletons)
* 100% test coverage
* Detailed error messages (using facebook's `invariant`)
* Modular: use only parts you need

## Roadmap
- [ ] Finalize the API
- [X] Create a data scope for simple data (de|re)hydration
- [X] Create application abstraction
- [X] Create action scope abstraction
- [X] Separate stores to mutable and immutable
- [ ] Write "Getting Started"
- [X] Make an example of isomorphic app
- [ ] Make an example for [Riot.js](https://muut.com/riotjs/)
- [ ] Find a way to avoid using mixins

## Installation
#### npm
```shell
npm install fflux
```

#### bower
```shell
bower install fflux
```

## Application
`Application` is an entry point for fflux.
```javascript
var Application = require('fflux/src/Application');

var app = new Application();
```

Also, you can use config object to pre-set application enviroment:

```javascript

var app = new Application({
    stores: {
        list: new ListStore(),
        wishlist: new WishlistStore()
    },
    actions: {
        list: listActions,
        wishlist: wishlistActions
    }
});
```

Once you got `app` instance, you can use it to access `storesScope` and `actionsScope` by using `app.stores()` or `app.actions()`. Also you're able to get access to specific store or action directly: `app.stores('some')` or `app.actions('some')`.

## Dispatcher
FFlux dispatcher extends [facebook's dispatcher](https://facebook.github.io/flux/docs/dispatcher.html#content) implementation.

```javascript
var Dispatcher = require('fflux/src/Dispatcher');
var dispatcher = new Dispatcher();

dispatcher.dispatch('SOME_ACTION', payload);
```

### Dispatcher API
* **register** - register store in dispatcher<br>
  After registration, store will receive dispatcher's actions<br>
  ```javascript
  dispatcher.register(store);
  ```

* **unregister** - unregister store from the dispatcher<br>
  Store wouldn't receive actions any more.<br>
  ```javascript
  dispatcher.unregister(store);
  ```

* **dispatch** - dispatch action to the stores:<br>
  ```javascript
  dispatcher.dispatch(actionName, actionPayload);`
  ```

* **waitFor** - wait for another store to process action first
  ```javascript
  var someStore = FFlux.ImmutableStore();

  dispatcher.waitFor([someStore]);
  ```

## Action Creators
Action Creators are commonly used to fetch/post data. All async stuff should happend here.

```javascript
var request = require('superagent');

var ActionCreatorExample = {
  /**
   * Fetch data from server
   * @param {Function} dispatch
   * @param {Object} criteria
   */
  fetchData: function(dispatch, criteria) {
    request
      .get('/some/url')
      .end(function(res) {
        dispatch('FETCH_DATA', res);
      });
  },

  /*
   * Post data to the server
   * @param {Function} dispatch
   * @param {Object} data
   */
  postData: function(dispatch, data) {
    request
      .post('/some/url')
      .send(data)
      .end(function(err, res) {
        if (err) {
          dispatch('FETCH_DATA_ERROR', err);
        }
        dispatch('POST_DATA', res);
      });
  }
};
```

In this example I use [`superagent`](https://github.com/visionmedia/superagent) as isomorphic library for AJAX calls. As you probably mentioned, in every function we got `dispatch` as a first parameter. That's done to simplify your life. Every time you register action creator in the action scope, this dependency injection managed for you automaticly.

## Action Scope
The point is, that as like with the stores, it's handy to keep all your `action creators` inside your application instance. So, to provide you consistant interface (with data scope), action scope has been created. **Action Scope isn't aimed to be used outside from the application**

```javascript
var app = new Application({
  actions: {
    scope: scopeActions
  }
});

app.actions(); // ActionScope instance
```

### Action Scope API
* **register** - register action creator object in the scope
  ```javascript
  app.actions().register('otherScope', otherScopeActions);
  ```

* **unregister** - unregister action creator object by name
  ```javascript
  app.actions().unregister('otherScope');
  ```

* **get** - register action creator object in the scope
  ```javascript
  app.actions().get('scope'); // scope action creator
  ```

## Stores
In fflux, you can use mutable and immutable stores. If you want to work with store's state as native javascript object - you should use [mutable store](#mutable-store). If you prefer immutable structures, [immutable stores](#immutable-store) - is your choice.
Both stores have the same API:

### Store API
* **setState** - merge current state with the one provided<br>
  *Hint: if you're using [mutable stores](#mutable-store), every `setState` will emit `change` event. In the case of [immutable stores](#immutable-store), `change` event will be emitted only if new state is different from the current one.*<br>
  ```javascript
  store.setState({ key: value });
  ```

* **replaceState** - replace current state with a given one<br>
  ```javascript
  store.replaceState({ key: value });
  ```

* **registerAction** - register action handler<br>
  ```javascript
  store.registerAction(actionName, actionHandler);
  ```

* **unregisterAction** - unregister action handler<br>
  ```javascript
  store.unregisterAction(actionName);
  ```

### Mutable Store
Mutable store is a basic store you have in fflux:

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
   * Get initial state
   * Works the same way as in React
   * @return {Any} Initial state
   */
  getInitialState: function() {
    return {};
  }

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

Every handler could be a method name of the store instance or a standalone function. In every action handler you can use `waitFor` method as described [here](http://facebook.github.io/flux/docs/dispatcher.html#content):

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

You can register/unregister action handlers dynamically after store initialization:

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

And the last, but not least: states. FFlux stores have a state like React components, so you can easily work with it using already familiar functions:
`setState`, `getState`, `replaceState` and `getInitialState`.

### Immutable store
Immutable store inherits form [mutable store](#mutable-store) and enhances its functionality with [immutable data](http://facebook.github.io/immutable-js/).

```javascript
var store = new FFlux.ImmutableStore();

/*
 * currentState will be empty Immutable.Map
 */
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

/*
 * If we using immutable data,
 * any manipulation with `currentState`
 * will create a new immutable object
 */
var newState = currentState
  .updateIn(['a', 'b', 'c'], mutator)
  .set('b', 'new key')
  .set('c', currentState.getIn(['a', 'b', 'c']));

// currentState is still the same (empty Immutable.Map)

store.replaceState(newState);
```

Any store state operation (e.g. `setState` or `replaceState`) will trigger `change` event **only** in the cases when previous state isn't equal to the new one.

## Data Scope
Data Scope is used in the fflux applications for grouping stores and providing simple interface to manage them. For example, it's very handy for building isomorphic applications, when you need to serialize and deserialize all your stores to transmit them from server to client.

```javascript
var app = new Application({
  stores: {
    someStore: someStore
  }
});
```

Also, if you're using data scope with [`Application`](#application), all stores you add to data scope would be automaticly registered at dispatcher (if they weren't registered before).

### Data Scope API
* **register** - register store in the scope
  ```javascript
  app.stores().register('someStore', someStore);
  ```

* **get** - get registered store by name
  ```javascript
  app.stores().get('someStore');
  ```

* **unregister** - unregister store from the scope
  ```javascript
  app.stores().unregister('someStore');
  ```

* **dehydrate** - stringify store's state
  ```javascript
  var dataString = app.stores().dehydrate();
  ```

* **rehydrate** - fill store with pre-served data
  ```javascript
  app.stores().rehydrate(dataString);
  ```

Once you registered all of your stores in the scope, you can simply `dehydrate` it and get a data string, using which you can `rehydrate` scope back in the future. It's especially handy when you're pre-fetching data on the back-end and want to transmit it to front-end.

For further reading check [this example](https://github.com/Kureev/fflux-isomorphic-example).

## View layer
FFlux is view-agnostic.
The only thing that fflux provides you - a mixin for react to bind to store, which would add a `storeDidUpdate` function to handle store's update:

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

  getInitialState: function() {
    return store.getState();
  },

  /**
   * After store emit `change` event
   * this function will be invoked
   * @return {Void}
   */
  storeDidUpdate: function() {
    this.setState(store.getState());
  },

  render: function() {
    var state = this.getState();
    return (
      <div>{state.get('something')}</div>
    );
  }
});

/**
 * That's it, now you can render `MyComponent` and
 * as soon as `store` will emit `change` event,
 * your component will be redrawn
 */
React.render(<MyComponent />, document.body);
```
