import meow from 'meow';

const cli = meow(
  `
	Options
	  --entry, -e  path to the package index file. relative to the package directory
    --exclude, -i list of directories that will be excluded when searching for imports
    --extensions, -x  list of file extensions to be considered during the search
    --dir, -d  path to the directory where imports should be searched for
    --collect-usages, -u  outputs a list of all unique uses of the package
`,
  {
    importMeta: import.meta,
    allowUnknownFlags: false,
    description: false,
    flags: {
      entry: { type: 'string', shortFlag: 'e' },
      exclude: { type: 'string', shortFlag: 'i' },
      extensions: { type: 'string', shortFlag: 'x' },
      dir: { type: 'string', shortFlag: 'd' },
      collectUsages: { type: 'string', shortFlag: 'u' },
    },
  },
);

export { cli };
