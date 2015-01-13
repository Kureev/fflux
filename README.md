fflux.js
==========
*[Flux](https://facebook.github.io/flux/)-based library*

Some time ago Facebook engineers released a specification describing flux - one-way data flow architecture. After that, they released a Dispatcher constructor, but skipped store, actions and react view/controller-binding parts. In fflux.js I tried to supplement existing code to complete architecture with a tiny layer of the user-friendly API for it.

Application
-----------

To create new flux-based application:

```javascript
var app = new FFlux();
```

All dispatcher's API endpoints are included in the <code>app</code> instance. So, you can use it for create and dispatch actions:

```javascript
/**
 * Create action
 */
var someAction = app.createAction(type, payload);

/**
 * Dispatch action to stores
 */
app.dispatch(someAction);
```

or register/unregister stores from the application dispatcher:

```javascript
/**
 * Create store
 */
var store = app.createStore({ ... });

/**
 * By default, store is auto-registered in the app's dispatcher,
 * so first of all we'll unregister it
 */
app.unregister(store);

/**
 * Nothing will happend, because store has been unregistered from the dispatcher
 */
app.dispatch(someAction);

/**
 * And after that we'll register it back
 */
app.register(store);

/**
 * And now we'll see console.log message
 */
app.dispatch(someAction);
```

Actions
-------

Actions are used for sending messages from sources to dispatcher. Actions are just simple JS objects with specific interface. You can create them natively:

```javascript
var action = {
  type: 'SOME_ACTION',
  data: {...}
}
```

**note:** `type` key is required for every action in the system!

Also, you can use small fflux function, designed for that:

```javascript
var action = app.createAction('SOME_ACTION', {...});
```
It will guarantee you accordance with the system interface.


Store
-----

To create a store you need to have an instance of the application. Basic store looks like this:

```javascript
var app = new FFlux();

/**
 * Handler for OTHER_ACTION
 * @param {object} data Payload
 * @return {void}
 */
function otherActionHandler(data) {
  //...
}

var store = app.createStore({
  /**
   * In this property we declare list
   * of the actions we're interested in.
   *
   * For every of those actions we specify handler function. It can be independent
   * function like `otherActionHandler` or instance method like `someMethod`
   */
  actions: {
    'SOME_ACTION': 'someMethod'
    'OTHER_ACTION': otherActionHandler
  },

  /**
   * Handler for SOME_ACTION
   * @param {object} data Payload
   * @return {void}
   */
  someMethod: function(data) {
    console.log('Some method has been called');
  }
});
```

As you can see from the example above, you will have an actions property which provides you a possibility to use declarative style for describing handlers for different action types (looks like backbone's events, huh?). In every action handler you can use waitFor method as it's described on the [flux's dispatcher page](http://facebook.github.io/flux/docs/dispatcher.html#content):

```javascript
{
  /**
   * Some action's handler
   * @param {object} data Payload
   * @return {void}
   *
   * @description For invoke some function(s) only *after* other store
   * process action, we need to use `waitFor` method
   */
  someMethod: function(data) {
    /**
     * Now we have no idea if `storage` already processed the data
     * But after calling `waitFor` we can be sure, that `storage` had finished processing
     */
    app.waitFor([storage]);
  }
}
```

Every store by default will be automatically assigned to the application dispatcher. If for some reason you wouldn't want to auto-bind store to the dispatcher, use flag false after object with constructor settings:

```javascript
app.createStore({...}, { register: false });
```

You can register/unregister action handlers dynamicly after store initialization:

```javascript
var store = app.createStore({...});

/**
 * Action handler function
 * @param {object} data Payload
 * @return {void}
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

That's what we have in our flux stores!

Views-Controllers or just React components
------------------------------------------

Views are just React components. For simplification binding to the stores, I added listenTo property, which accepts object (store instance) or array of the stores. It automatically binds view to change event of those store(s). Each change event will trigger `onChange` method of the view:

```javascript
var store = app.createStore({...});

var HelloMessage = app.createView({
  /**
   * Listen to `store`.
   * You can also listen to multiple stores
   * using following syntax:
   *
   * listenTo: [store1, store2]
   */
  listenTo: store,

  /**
   * Initial state of the view
   * Probably, could be store.getState()
   * @return {object}
   */
  getInitialState: function() {
      return {};
  },

  /**
   * Storege's `change` event handler
   * @return {void}
   */
  onChange: function() {
      this.setState(store.getState());
  },

  /**
   * Standart React render function
   * @return {React.DOM}
   */
  render: function() {
      return <div>Hello {this.state.name}</div>;
  }
});