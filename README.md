fflux.js
==========
*[Flux](https://facebook.github.io/flux/)-based library*

Some time ago Facebook engineers released a specification describing flux - one-way data flow architecture. After that, they released a Dispatcher constructor, but skipped store, actions and react view/controller-binding parts. In fflux.js I tried to supplement existing code to complete architecture with a tiny layer of the user-friendly API for it.

Dispatcher
-----------
To create a dispatcher:

```javascript
var dispatcher = new FFlux();
```

It's very similar with facebook's realization (because it's based on it), but register/unregister methods changed regarding to specific of the current library:

```javascript
/**
 * Create store
 * @type {FFluxStore}
 */
var store = FFlux.createStore({ ... });

/**
 * Create action
 * @type {FFluxAction}
 */
var someAction = FFlux.createAction({ ... });

/**
 * Dispatch our action to the system
 */
dispatcher.dispatch(someAction);
```

But as you see, nothing happens. The reason is that the store has to be registered in the dispatcher:


```javascript
dispatcher.register(store);

```

Now all dispatched events will be available in the action handlers

Actions
-------
Actions are used for sending messages from different sources to dispatcher. They're just simple JS objects with specific interface. You can create them natively:

```javascript
var action = {
  type: 'SOME_ACTION',
  data: {...}
}
```

**note:** `type` key is required for every action in the system!

Or you can use small fflux function, designed for that:

```javascript
var action = FFlux.createAction('SOME_ACTION', {...});
```
It will guarantee you accordance with the system interface.


Store
-----
Store instances should process and store applicatoin data(**they shouldn't fetch or push data!**). Basic store looks like this:

```javascript
/**
 * Handler for OTHER_ACTION
 * @param {object} data Payload
 * @return {void}
 */
function otherActionHandler(data) {
  console.log('Some other function has been called');
}

var store = FFlux.createStore({
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

As you can see from the example above, you will have an actions property which provides you a possibility to use declarative style for describing handlers for different action types (looks like backbone's events, huh?). In every action handler you can use `waitFor` method as it's described on the [flux's dispatcher page](http://facebook.github.io/flux/docs/dispatcher.html#content):

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
     * Now we have no idea if `storage` store already processed the data
     * But after calling `waitFor` we can be sure, that it's done
     */
    dispatcher.waitFor([storage]);
  }
}
```

You can register/unregister action handlers dynamicly after store initialization:

```javascript
var store = FFlux.createStore({...});

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
var store = FFlux.createStore({...});

/**
 * React class to describe component
 */
var MyComponentClass = React.createClass({
  /**
   * Mixin our auto-binding to the store(s)
   * @type {Array}
   */
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

  /**
   * After store emit `change` event
   * this function will be invoked
   * @return {void}
   */
  onStoreUpdated: function() {...},

  render: function() {...}
});

// Create React component (using 0.12.2 syntax)
var MyComponent = React.createElement(MyComponentClass);

/**
 * That's it, now you can render `MyComponent` and
 * as soon as `store` will emit `change` event, 
 * your component will be redrawn
 */
React.render(MyComponent, document.body);
``` 