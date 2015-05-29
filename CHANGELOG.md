## v0.13.1 (May 29, 2015)
* Added simple way to get actions/store:
  instead of using `app.stores().get('some')` you can now use `app.stores('some')`

## v0.13.0 (Mar 22, 2015)
* Introduced Application
* Introduced ActionScope
* New interface of shared actions
* DataScope need dispatcher as a parameter
* DataScope automaticly attach stores to dispatcher
* Stores now accept string|array for rehydration (only string before)
* Fix: Store's dispatchToken will be automaticly removed after store unregister

## v0.12.1 (Mar 20, 2015)
* Fixed issue with initializing DataScope

## v0.12.0 (Mar 20, 2015)
* Introduced DataScope
* Added 2 functions to stores: dehydrate & rehydrate

## v0.11.2 (Mar 08, 2015)
* Examples: TODO list adapted for v0.11.*
* Major readme update

## v0.11.1 (Mar 08, 2015)
* Fixed a bug with `getInitialState()`
* Removed deprecated code from dispatcher
* Updated tests

## v0.11.0 (Mar 05, 2015)
* Introduced `immutable` and `mutable` stores
* Cleaned up unused tests from examples
* Updated readme

## v0.10.3 (Feb 28, 2015)
* Updated documentation about [immutable state](http://facebook.github.io/immutable-js/) in the state.
* Finalized `todo-mvc` example

## v0.10.2 (Feb 27, 2015)
* Examples folder with `todo-mvc` example
* `deepMerge` in the `setState` replaced by `merge`

## v0.10.1 (Feb 20, 2015)
* A bit more clean and strict .jshintrc
* Code formatted to max 80 chars / line

## v0.10.0 (Feb 20, 2015)
* Changed object create method from factory to constructor. There are no more `FFlux.createDispatcher` and `FFlux.createStore`.
Instad of them you should use `new FFlux.Dispatcher()` and `new FFlux.Store()`.
* New method `replaceStore`. Works the same as React's `replaceStore`.
* Added maintainers block to `package.json`

## v0.9.2 (Feb 19, 2015)
* Added invariant assertations. Now you all of your errors will be informative.
* Removed error if you trying to remove non-existing listener

## v0.9.1 (Feb 19, 2015)
* Fix logic issue about default return value of store's `getInitialState`

## v0.9.0 (Feb 18, 2015)
* Stores now have local immutable state (using immutable.js) and trigger "change" event only when something really changed;
* Two new public methods: `getInitialState` & `setState` (see usage examples at React.js Components);
* Added changelog