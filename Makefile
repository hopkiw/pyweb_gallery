all: run

dev: main.js
	cp main.js be/ui/assets/
	python app.py --debug

run: main.js
	cp main.js be/ui/assets/
	python app.py

main.js: $(shell find presrc -type f)
	./node_modules/.bin/babel -d src/ presrc/* && \
		webpack --mode development && \
		cp dist/main.js main.js
