## v0.9.2 (Feb 19, 2015)
* Added invariant assertations. Now you all of your errors will be informative.
* Removed error if you trying to remove non-existing listener

## v0.9.1 (Feb 19, 2015)
* Fix logic issue about default return value of store's `getInitialState`

## v0.9.0 (Feb 18, 2015)
* Stores now have local immutable state (using immutable.js) and trigger "change" event only when something really changed;
* Two new public methods: `getInitialState` & `setState` (see usage examples at React.js Components);
* Added changelog