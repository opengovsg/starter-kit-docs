// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

const { z } = require("zod");

require("dotenv").config();

const env = z
  .object({
    ALGOLIA_APP_ID: z.string(),
    ALGOLIA_SEARCH_API_KEY: z.string(),
    ALGOLIA_INDEX_NAME: z.string(),
  })
  .or(z.object({}))
  .parse(process.env);

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Starter Kit",
  tagline: "Start building for public good easily, and in minutes",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://start.open.gov.sg",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "opengovsg", // Usually your GitHub org/user name.
  projectName: "starter-kit-docs", // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  plugins: ["docusaurus-plugin-sass"],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
        },
        theme: {
          customCss: require.resolve("./src/css/custom.scss"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "Starter Kit",
        logo: {
          alt: "My Site Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "docSidebar",
            position: "left",
            label: "Docs",
          },
          {
            href: "https://github.com/opengovsg/starter-kit",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        logo: {
          alt: "Open Government Products Logo",
          src: "img/logo.svg",
          href: "https://open.gov.sg",
        },
        links: [
          {
            label: "Getting Started",
            to: "/docs/getting-started",
          },
          {
            label: "Optional Features",
            to: "/docs/optional-features",
          },
          {
            label: "Guides",
            to: "/docs/guides",
          },
          {
            label: "Concepts",
            to: "/docs/concepts",
          },
        ],

        copyright: `Copyright © ${new Date().getFullYear()} Open Government Products. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      ...(env.ALGOLIA_SEARCH_API_KEY
        ? {
            algolia: {
              appId: env.ALGOLIA_APP_ID,
              apiKey: env.ALGOLIA_SEARCH_API_KEY,
              indexName: env.ALGOLIA_INDEX_NAME,
            },
          }
        : {}),
    }),
};

module.exports = config;
