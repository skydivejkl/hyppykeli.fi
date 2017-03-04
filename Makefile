export PATH := node_modules/.bin:$(PATH)
export SHELL := /bin/bash # Required for OS X for some reason
bundle = static/dist/bundle.js


all: dist-changes-hide yarn js

yarn:
	yarn

js:
	NODE_ENV=production webpack -p --progress

server:
	node server/server.js

server-watch:
	nodemon --watch server/ server/server.js

js-server:
	webpack-dev-server -d --progress --inline --port 8081 --host 0.0.0.0
	
dist-changes-hide:
	git update-index --assume-unchanged $(bundle)

dist-changes-show:
	git update-index --no-assume-unchanged $(bundle)

assert-clean-git: dist-changes-show
	git checkout $(bundle)
	@test -z "$(shell git status . --porcelain)" || (echo "Dirty git tree: " && git status . --porcelain ; exit 1)

commit-bundle: assert-clean-git js
	$(MAKE) dist-changes-show
	git add $(bundle)
	git status . --porcelain
	git commit -m "Commit bundle"
	$(MAKE) dist-changes-hide


add-production:
	git remote add production hyppykeli@skydivejkl.fi:hyppykeli

deploy:
	git push production HEAD:master
