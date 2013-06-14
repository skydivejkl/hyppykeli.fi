export PATH := node_modules/.bin:$(PATH)

all: css npm js-dev

npm:
	npm install

js:
	mkdir -p public
	browserify $(DEV) \
		--noparse ./client/vendor/jquery.js \
		--noparse ./client/vendor/Chart.js \
		--noparse ./client/vendor/flotr2.nolibs.js \
		client/index.js > public/bundle.js

min:
	uglifyjs public/bundle.js -o public/bundle.js --mangle

js-dev:
	$(MAKE) js DEV=-d


css:
	stylus client/styl/index.styl --out public/styles/

deploy: css js min
	git checkout -b heroku-tmp
	git add -f config.json public/bundle.js public/styles/index.css
	git commit -m "deploy"
	git push -f git@heroku.com:morning-garden-2851.git heroku-tmp:master
	git checkout master
	git branch -D heroku-tmp

dev: css js-dev

watch:
	./watch.sh make dev
