export PATH := node_modules/.bin:$(PATH)


watch-scss:
	node-sass --watch --source-comments map  --source-map -o public/app.css styles/app.scss



