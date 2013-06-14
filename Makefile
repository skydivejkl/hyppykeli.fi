export PATH := node_modules/.bin:$(PATH)

all: npm build-dev

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

deploy: build min
	git checkout -b heroku-tmp
	git add -f config.json public/bundle.js
	git commit -m "deploy"
	git push git@heroku.com:morning-garden-2851.git heroku-tmp:master
	git checkout master
	git branch -D heroku-tmp

watch:
	./watch.sh make build-dev
