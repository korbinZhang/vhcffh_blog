import { defineConfig } from 'rspress/config'
import katex from 'rspress-plugin-katex'

export default defineConfig({
  // 文档根目录
  root: 'content',
  plugins: [katex()],
  head: [
    '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
    '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
    '<link rel="manifest" href="/site.webmanifest">',
  ],
  themeConfig: {
    nav: [],
    outline: false,
    hideNavbar: 'always',
  },
})
