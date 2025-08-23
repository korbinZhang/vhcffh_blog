import React from 'react'
import { usePageData } from 'rspress/runtime'
import Theme from 'rspress/theme'

const Layout = () => {
  const { page } = usePageData()
  return (
    <Theme.Layout
      uiSwitch={{
        showSidebar: page.pagePath.startsWith('book'),
        showDocFooter: !page.pagePath.startsWith('tool'),
      }}
    />
  )
}

export default {
  ...Theme,
  Layout,
}

export * from 'rspress/theme'
