// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'aidbox-develop-starter-guide ',
    tagline: 'work in progress',
    url: 'https://your-docusaurus-test-site.com',
    baseUrl: '/aidbox-develop-starter-guide/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'beda-software', // Usually your GitHub org/user name.
    projectName: 'aidbox-develop-starter-guide', // Usually your repo name.

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
                    editUrl: 'https://github.com/beda-software/aidbox-develop-starter-guide',
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
            navbar: {
                title: 'aidbox-develop',
                logo: {
                    alt: 'Logo',
                    src: 'img/logo.svg',
                },
                items: [
                    {
                        type: 'doc',
                        docId: 'tutorial',
                        position: 'left',
                        label: 'Tutorial',
                    },
                ],
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'Docs',
                        items: [
                            {
                                label: 'Tutorial',
                                to: '/docs/tutorial',
                            },
                            {
                                label: 'Guide repository',
                                href: 'https://github.com/beda-software/aidbox-develop-starter-guide',
                            },
                        ],
                    },
                    {
                        title: 'Special links',
                        items: [
                            {
                                label: 'Aidbox documentation',
                                href: 'https://docs.aidbox.app/',
                            },
                            {
                                label: 'Aidbox-react repository',
                                href: 'https://github.com/beda-software/aidbox-react',
                            },
                            {
                                label: 'FHIR documentation',
                                href: 'https://www.hl7.org/fhir/documentation.html',
                            },
                        ],
                    },
                    {
                        title: 'More',
                        items: [
                            {
                                label: 'GitHub',
                                href: 'https://github.com/beda-software',
                            },
                            {
                                label: 'Beda Software Site',
                                href: 'https://beda.software/',
                            },
                        ],
                    },
                ],
                copyright: `${new Date().getFullYear()} Beda Software`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
};

module.exports = config;
