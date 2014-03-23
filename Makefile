export PATH := node_modules/.bin:$(PATH)

scss:
	node-sass --source-comments map  --source-map -o public/app.css styles/app.scss

scss-watch:
	node-sass --watch --source-comments map  --source-map -o public/app.css styles/app.scss



