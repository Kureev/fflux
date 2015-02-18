MAIN = src/index.js

dist/fflux.min.js: dist/fflux.js
	./node_modules/uglify-js/bin/uglifyjs -c -m  --screw-ie8 $^ -o $@

dist/fflux.js: $(shell find src -name '*.js')
	mkdir -p $(@D)
	./node_modules/browserify/bin/cmd.js $(MAIN) -s FFlux > $@