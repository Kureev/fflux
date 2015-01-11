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

In short, all dispatcher's API endpoints are included in the <code>app</code> instance. So, you can use it for create and dispatch actions:
```javascript
// Create action
var someAction = app.createAction(type, payload);

// Dispatch action to stores
app.dispatch(someAction);
```
or register/unregister stores from the application dispatcher:
```javascript
// Create store
var store = app.createStore({ ... });

// By default, store is auto-registered in the app's dispatcher,
// so first of all we'll unregister it
app.unregister(store);

// Nothing will happend, because store has been unregistered from the dispatcher
app.dispatch(someAction);

// And after that we'll register it back
app.register(store);

// And now we'll see console.log message
app.dispatch(someAction);
```

Store
-----
To create a store you need to have an instance of the application. Basic store looks like this:
```javascript
var app = new FFlux();

var store = app.createStore({
  actions: {
    'SOME_ACTION': 'someMethod'
  },
  
  someMethod: function() {
    console.log('Some method has been called');
  }
});
```
Also, in every action handler you can use waitFor method as described on the flux homepage:
```javascript
{
  //...
  someMethod: function() {
    // Now we have no idea if storage already processed the data
    app.waitFor([storage]);
    // Now we do
  }
  //...
}
