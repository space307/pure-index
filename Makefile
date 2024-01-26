build:
	rm -rf ./dist; \
	npx tsup-node ./src/bin/index.ts ./src/api/index.ts --format esm --dts --minify

prettierCheck:
	npx prettier ./**/*.ts --check

prepublishOnly:
	npm i && make prettierCheck;
	npm t && npm run build

outdated:
	npm outdated && npm --prefix ./website outdated
