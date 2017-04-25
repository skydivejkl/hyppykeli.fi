export PATH := node_modules/.bin:$(PATH)
export SHELL := /bin/bash # Required for OS X for some reason
export JS_SERVER_PORT := 8081
bundle = static/dist/bundle.js


all: deps prerender js

deps:
	yarn

js:
	NODE_ENV=production webpack -p --progress

prerender:
	babel-node ssr/mock.js

server-production:
	NODE_ENV=production node server/server.js

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

