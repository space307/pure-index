build:
	rm -rf ./dist && npx tsc --project ./tsconfig.build.json && npx tsc-alias -v

prettierCheck:
	npx prettier ./**/*.ts --check

prepublishOnly:
	npm i && make prettierCheck && npm t && npm run build

outdated:
	npm outdated && npm --prefix ./website outdated
