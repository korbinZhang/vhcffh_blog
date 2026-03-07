import * as path from 'node:path';
import { defineConfig } from '@rspress/core';
import { pluginRss } from '@rspress/plugin-rss';
import pluginSitemap from './plugins/sitemap';
import ga from 'rspress-plugin-google-analytics';
import mermaid from 'rspress-plugin-mermaid';
import katex from './plugins/katex';

export default defineConfig({
  root: path.join(__dirname, 'content'),
  logo: {
    light: '/favicon-32x32.png',
    dark: '/favicon-32x32.png',
  },
  lang: 'zh',
  logoText: `Korbin`,
  icon: '/favicon.ico',
  title: `Korbin's Personal Website`,
  description: '一个简单的个人博客，用于记录笔记',
  head: [
    '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
    '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
    '<link rel="manifest" href="/site.webmanifest">',
    '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3597458182538053" crossorigin="anonymous"></script>',
  ],
  themeConfig: {
    enableScrollToTop: true,
  },
  plugins: [
    katex(),
    pluginSitemap({
      domain: 'https://www.vhcffh.com',
    }),
    ga({ id: `G-D9NXKT8Z3L` }),
    mermaid(),
    pluginRss({
      siteUrl: 'https://www.vhcffh.com',
      feed: { test: 'blog/' },
    }),
  ],
  route: {
    exclude: ['components/**/*'],
  },
  outDir: 'dist',
  globalStyles: path.join(__dirname, 'tailwind.css'),
});
