import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://space307.github.io',
  base: '/pure-index',
  integrations: [
    starlight({
      title: '🌿Pure Index',
      social: {
        github: 'https://github.com/space307/pure-index',
      },
      sidebar: [
        {
          label: 'Getting started',
          items: [
            { label: 'Introduction', link: '/' },
            { label: 'CLI', link: '/intro/cli' },
          ],
        },
        {
          label: 'How to',
          items: [{ label: 'Find unused code inside a package', link: 'how-to/find-unused-code-inside-package' }],
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
      customCss: ['./src/styles/layout.css'],
    }),
  ],
});
