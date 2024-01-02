import meow from 'meow';

// Need more flexibility? Use JS API
const cli = meow(
  `
	Options
	  --entry, -e  path to the package index file. relative to the package directory
    --collect-usages, -u  outputs a list of all unique uses of the package
`,
  {
    importMeta: import.meta,
    allowUnknownFlags: false,
    description: false,
    flags: {
      entry: { type: 'string', shortFlag: 'e' },
      collectUsages: { type: 'string', shortFlag: 'u' },
    },
  },
);

export { cli };
