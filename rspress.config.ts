import { defineConfig } from 'rspress/config'
import katex from 'rspress-plugin-katex'
import { pluginRss } from '@rspress/plugin-rss'
import sitemap from './plugins/sitemap'
import ga from 'rspress-plugin-google-analytics'

export default defineConfig({
  // 文档根目录
  root: 'content',
  logo: '/favicon-32x32.png',
  logoText: `Korbin's blog`,
  icon: '/favicon.ico',
  title: `Korbin's blog`,
  description: '一个简单的个人博客，用于记录笔记',
  head: [
    '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
    '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
    '<link rel="manifest" href="/site.webmanifest">',
  ],
  themeConfig: {
    outlineTitle: '目录',
    outline: false,
    enableScrollToTop: true,
    nextPageText: '下一篇',
    prevPageText: '上一篇',
    lastUpdated: true,
    lastUpdatedText: '更新时间',
    sidebar: {},
  },
  plugins: [
    katex(),
    pluginRss({
      siteUrl: 'https://www.vhcffh.com',
    }),
    sitemap({
      domain: 'https://www.vhcffh.com',
    }),
    ga({ id: `G-D9NXKT8Z3L` }),
  ],
})
