import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://space307.github.io',
  base: '/pure-index',
  favicon: '/images/favicon.svg',
  integrations: [
    starlight({
      title: '🌿Pure Index',
      description: '', // todo: add normal
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
            { label: 'Find unused code inside a package', link: 'how-to/find-unused-code-inside-package' },
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
            { label: 'Limitations', link: 'explanation/limitations' },
          ],
        },
      ],
      tableOfContents: {
        maxHeadingLevel: 4,
      },
    }),
  ],
});
