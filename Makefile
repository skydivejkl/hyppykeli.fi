
build:
	node_modules/.bin/browserify \
		--noparse ./client/vendor/jquery.js \
		--noparse ./client/vendor/Chart.js \
		client/index.js > public/bundle.js
