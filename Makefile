
all: npm build

npm:
	npm install

build:
	mkdir -p public
	node_modules/.bin/browserify -d \
		--noparse ./client/vendor/jquery.js \
		--noparse ./client/vendor/Chart.js \
		--noparse ./client/vendor/flotr2.nolibs.js \
		client/index.js > public/bundle.js

watch:
	./watch.sh make
