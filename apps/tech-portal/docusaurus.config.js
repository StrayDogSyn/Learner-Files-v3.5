// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'StrayDog Tech Portal',
  tagline: 'AI-Powered Development Documentation & Showcase',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://straydogsyn.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/tech-portal/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'StrayDogSyn', // Usually your GitHub org/user name.
  projectName: 'Learner-Files-v3.5', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/StrayDogSyn/Learner-Files-v3.5/tree/main/apps/tech-portal/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/StrayDogSyn/Learner-Files-v3.5/tree/main/apps/tech-portal/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'StrayDog Tech Portal',
        logo: {
          alt: 'StrayDog Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            to: '/blog',
            label: 'Blog',
            position: 'left'
          },
          {
            to: '/showcase',
            label: 'AI Showcase',
            position: 'left'
          },
          {
            href: 'https://github.com/StrayDogSyn/Learner-Files-v3.5',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/intro',
              },
              {
                label: 'AI Integration',
                to: '/docs/ai-integration',
              },
              {
                label: 'API Reference',
                to: '/docs/api',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub Discussions',
                href: 'https://github.com/StrayDogSyn/Learner-Files-v3.5/discussions',
              },
              {
                label: 'Issues',
                href: 'https://github.com/StrayDogSyn/Learner-Files-v3.5/issues',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/StrayDogSyn/Learner-Files-v3.5',
              },
              {
                label: 'Corporate Site',
                href: 'http://localhost:3001',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} StrayDog Syndicate. Built with Docusaurus & AI.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['bash', 'json', 'typescript', 'jsx', 'tsx'],
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
    }),

  markdown: {
    mermaid: true,
  },