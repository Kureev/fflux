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