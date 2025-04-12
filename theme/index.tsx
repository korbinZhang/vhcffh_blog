import React from 'react'
import { usePageData } from 'rspress/runtime'
import Theme from 'rspress/theme'

const Archives = () => {
  const { siteData } = usePageData()
  const pages = siteData.pages
    .map((page) => ({
      year: new Date(page.frontmatter.date as string).getFullYear(),
      month: new Date(page.frontmatter.date as string).getMonth(),
      date: new Date(page.frontmatter.date as string),
      title: page.title,
      route: page.routePath,
    }))
    .filter((page) => page.year > 2000 && page.year <= new Date().getFullYear())
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  let lastYear = -1
  let docLists: React.ReactNode[] = []
  for (const page of pages) {
    if (lastYear != page.year) {
      lastYear = page.year
      docLists.push(
        <h2
          className="mt-12 mb-6 pt-8 text-2xl tracking-tight border-t-[1px] border-divider-light font-semibold"
          key={lastYear}
        >
          {lastYear}
        </h2>
      )
    }
    docLists.push(
      <div className="rounded-lg hover:bg-gray-100 hover:text-blue-600">
        <a
          className="block px-4 py-1"
          key={page.title}
          href={page.route}
        >
          <span>{page.title}</span>
          <time className="float-right">
            {(page.date.getMonth() + 1).toString().padStart(2, '0') +
              '-' +
              page.date.getDate().toString().padStart(2, '0')}
          </time>
        </a>
      </div>
    )
  }
  let docContent = (
    <div className='text-current'>
      <h1 className="rspress-doc-title text-3xl mb-10 leading-10 tracking-tight font-semibold">
        共计 {pages.length} 篇文章
      </h1>
      {docLists}
    </div>
  )
  return <Theme.Layout beforeDocContent={docContent} />
}

const Layout = () => {
  const { page } = usePageData()
  const { frontmatter } = page
  if (frontmatter.layout === 'archives') {
    return <Archives />
  }
  return <Theme.Layout />
}

export default {
  ...Theme,
  Layout,
}

export * from 'rspress/theme'
