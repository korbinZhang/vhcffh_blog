import { defineConfig } from 'rspress/config'
import katex from 'rspress-plugin-katex'
import sitemap from './plugins/sitemap'
import ga from 'rspress-plugin-google-analytics'
import path from 'path'
import mermaid from 'rspress-plugin-mermaid'

export default defineConfig({
  // 文档根目录
  root: 'content',
  logo: '/favicon-32x32.png',
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
    outlineTitle: '目录',
    outline: false,
    enableScrollToTop: true,
    searchPlaceholderText: '搜索',
    nextPageText: '下一篇',
    prevPageText: '上一篇',
  },
  plugins: [
    katex(),
    sitemap({
      domain: 'https://www.vhcffh.com',
    }),
    ga({ id: `G-D9NXKT8Z3L` }),
    mermaid(),
  ],
  globalStyles: path.join(__dirname, 'theme/index.css'),
})
