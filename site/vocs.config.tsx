import { FrameMetadata } from '@coinbase/onchainkit';
import { defineConfig } from 'vocs';
import pkg from '../package.json';
import { sidebar } from './sidebar';

export const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? 'TEST_GA';

const ONCHAINKIT_TITLE = 'OnchainKit';
const ONCHAINKIT_DESCRIPTION = `React components and TypeScript utilities for top-tier onchain apps.`;

export default defineConfig({
  baseUrl: 'https://onchainkit.xyz',
  title: ONCHAINKIT_TITLE,
  titleTemplate: '%s · OnchainKit',
  description: ONCHAINKIT_DESCRIPTION,
  head: (
    <>
      <FrameMetadata
        image={{
          src: 'https://onchainkit.xyz/logo/v0-8.png',
        }}
        ogTitle={ONCHAINKIT_TITLE}
        ogDescription={ONCHAINKIT_DESCRIPTION}
      />
      <script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
        async
        defer
      />
      <script
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GOOGLE_ANALYTICS_ID}');
            `,
        }}
      />
    </>
  ),
  rootDir: './docs/',
  sidebar,
  socials: [
    {
      icon: 'github',
      link: 'https://github.com/coinbase/onchainkit',
    },
  ],
  theme: {
    accentColor: {
      light: '#d76260d9',
      dark: '#ce6170d9',
    },
  },
  topNav: [
    { text: 'Docs', link: '/getting-started', match: '/docs' },
    {
      text: 'Onchain App Example',
      link: 'https://github.com/coinbase/build-onchain-apps',
    },
    {
      text: 'Frame Example',
      link: 'https://github.com/Zizzamia/a-frame-in-100-lines',
    },
    {
      text: pkg.version,
      items: [
        {
          text: 'Changelog',
          link: 'https://github.com/coinbase/onchainkit/blob/main/CHANGELOG.md',
        },
        {
          text: 'Contributing',
          link: 'https://github.com/coinbase/onchainkit/blob/main/CONTRIBUTING.md',
        },
      ],
    },
  ],
});
