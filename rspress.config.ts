import * as path from 'node:path';
import { defineConfig } from '@rspress/core';
import { pluginLlms } from '@rspress/plugin-llms';
import { pluginRss } from '@rspress/plugin-rss';
import { pluginSitemap } from '@rspress/plugin-sitemap';
import { pluginBlogList } from 'rspress-plugin-blog-list';
import ga from 'rspress-plugin-google-analytics';
import katex from 'rspress-plugin-katex';
import mermaid from 'rspress-plugin-mermaid';

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
  description: '一个简单的个人网站，用于记录个人笔记、工具、项目等',
  head: [
    '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
    '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
    '<link rel="manifest" href="/site.webmanifest">',
    '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3597458182538053" crossorigin="anonymous"></script>',
  ],
  themeConfig: {
    enableScrollToTop: true,
    llmsUI: true,
  },
  plugins: [
    katex(),
    pluginSitemap({
      siteUrl: 'https://www.vhcffh.com',
    }),
    ga({ id: `G-D9NXKT8Z3L` }),
    mermaid(),
    pluginRss({
      siteUrl: 'https://www.vhcffh.com',
      output: { dir: './blog/' },
      feed: {
        id: 'rss',
        title: `Korbin's blog`,
        test: '/blog/2',
      },
    }),
    pluginBlogList(),
    pluginLlms({ mdFiles: { mdxToMd: true } }),
  ],
  route: {
    exclude: ['components/**/*'],
    cleanUrls: true,
  },
  outDir: 'dist',
  globalStyles: path.join(__dirname, 'tailwind.css'),
});
