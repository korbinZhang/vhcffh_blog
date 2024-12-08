import { defineConfig } from 'rspress/config'
import katex from 'rspress-plugin-katex'

export default defineConfig({
  // 文档根目录
  root: 'content',
  plugins: [katex()],
  themeConfig: {
    nav: [],
    outline: false,
    hideNavbar: 'always',
  }
})
