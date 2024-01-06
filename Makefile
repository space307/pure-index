build:
	rm -rf ./dist && npx tsc --project ./tsconfig.build.json && npx tsc-alias -v


prepublishOnly:
	npm run prettier:check && npm t && npm run build

prettierCheck:
	npx prettier ./**/*.ts --check

outdated:
	npm outdated && npm --prefix ./website outdated
