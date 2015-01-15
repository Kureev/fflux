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

View layer
------------------------------------------
Flux doesn't have any requirements for the view layer.
For the sake of the simplicity (and package size), I decided not to add any view layer and let programmers decide themselfs what to use. The only thing that fflux.js provides you - it's mixins for auto-binding to the stores:

```javascript
/**
 * Create some store
 */
var store = app.createStore({...});

/**
 * React class to describe component
 */
var MyComponentClass = React.createClass({
  mixins: [FFlux.mixins.binding],

  /**
   * Bind view to listen `store` changes.
   * Or, if you're looking for a way to 
   * bind `React Component` to multiple stores
   * you can use array syntax like this:
   * 
   * listenTo: [store, otherStore]
   */
  listenTo: store,

  render: function() {...}
});

// Create React component (using 0.12.2 syntax)
var MyComponent = React.createFactory(MyComponentClass);

/**
 * That's it, now you can render `MyComponent` and
 * if `store` will emit `change` event, your component
 * will be redrawn
 */
``` 