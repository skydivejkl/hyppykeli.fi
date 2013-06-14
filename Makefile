export PATH := node_modules/.bin:$(PATH)

all: npm build min

npm:
	npm install

build:
	mkdir -p public
	browserify $(DEV) \
		--noparse ./client/vendor/jquery.js \
		--noparse ./client/vendor/Chart.js \
		--noparse ./client/vendor/flotr2.nolibs.js \
		client/index.js > public/bundle.js

min:
	uglifyjs public/bundle.js -o public/bundle.js --mangle

build-dev:
	$(MAKE) build DEV=-d

watch:
	./watch.sh make build-dev
