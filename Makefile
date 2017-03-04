export PATH := node_modules/.bin:$(PATH)
export SHELL := /bin/bash # Required for OS X for some reason
bundle = static/dist/bundle.js


all: yarn js add-production

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

assert-clean-git:
	git checkout $(bundle)
	@test -z "$(shell git status . --porcelain)" || (echo "Dirty git tree: " && git status . --porcelain ; exit 1)

add-production:
	git remote add production hyppykeli@skydivejkl.fi:hyppykeli

deploy assert-clean-git:
	git push production HEAD:master
