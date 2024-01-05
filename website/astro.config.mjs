import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  site: 'https://space307.github.io',
  base: '/pure-index',
  integrations: [
    starlight({
      title: 'Pure Index',
      description: 'Pure Index is utility for packages. It helps to clean your packages of unused exports with ease.',
      social: {
        github: 'https://github.com/space307/pure-index',
      },
      sidebar: [
        {
          label: 'Getting started',
          items: [
            { label: 'Introduction', link: '/' },
            { label: 'CLI', link: '/intro/cli' },
            { label: 'JavaScript API', link: '/intro/js-api' },
          ],
        },
        {
          label: 'How to',
          items: [
            { label: 'Find unused package exports', link: 'how-to/find-unused-package-exports' },
            { label: 'Collect package usages', link: 'how-to/collect-package-usage' },
            { label: "Precisely override a package's entry", link: 'how-to/precisely-override-package-entry' },
            { label: 'Find unused code inside a package', link: 'how-to/find-unused-code-inside-package' },
            { label: 'Speed up the checking of exports', link: 'how-to/speed-up-the-checking-of-exports' },
          ],
        },
        {
          label: 'Reference',
          items: [{ label: 'Configuration', link: 'reference/configuration' }],
        },
        {
          label: 'Explanation',
          items: [
            { label: 'How It Works', link: 'explanation/how-it-works' },
            { label: 'Benchmarks', link: 'explanation/benchmarks' },
            { label: 'Limitations', link: 'explanation/limitations' },
          ],
        },
      ],
      tableOfContents: {
        maxHeadingLevel: 4,
      },
    }),
  ],
  output: 'hybrid',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
});
