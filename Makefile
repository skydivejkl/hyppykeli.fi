export PATH := node_modules/.bin:$(PATH)
export SHELL := /bin/bash # Required for OS X for some reason
export JS_SERVER_PORT := 8081
bundle = static/dist/bundle.js


all: deps build

build: app-shell js service-worker

service-worker: copy-workbox-scripts
	workbox inject:manifest

copy-workbox-scripts:
	cp node_modules/workbox-sw/build/importScripts/* static/vendor

app-shell:
	babel-node src/build-shell.js > static/shell.html

copy-config:
	scp hyppykeli@hyppykeli.fi:/apps/hyppykeli/hyppykeli.fi/config.json .

deps:
	yarn

js:
	NODE_ENV=production webpack -p --progress

server-production:
	NODE_ENV=production node server/server.js

.PHONY: server
server:
	node server/server.js

server-watch:
	nodemon --watch server/ server/server.js

js-server:
	webpack-dev-server -d --progress --inline --port $(JS_SERVER_PORT) --host 0.0.0.0

assert-clean-git:
	@test -z "$(shell git status . --porcelain)" || (echo "Dirty git tree: " && git status . --porcelain ; exit 1)

add-production:
	git remote add production hyppykeli@hyppykeli.fi:/apps/hyppykeli/hyppykeli.fi

deploy: assert-clean-git
	git push production HEAD:master

install-git-production-hooks:
	cp extra/post-receive .git/hooks/
	chmod +x .git/hooks/post-receive

update-trackjs:
	curl https://cdn.trackjs.com/releases/current/tracker.js > static/vendor/tracker.js
