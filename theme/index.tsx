import React from 'react'
import { usePageData , useLocation} from 'rspress/runtime'
import Theme, { Link } from 'rspress/theme'

const PostList = () => {
  const { siteData } = usePageData()
  const { search } = useLocation()
  let pageList: {
    date: string
    title: string
    route: string
  }[] = []

  for (const page of siteData.pages) {
    if (page.frontmatter.date) {
      pageList.push({
        date: page.frontmatter.date as string,
        title: page.title,
        route: page.routePath,
      })
    }
  }
  pageList.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
  if (!search.includes('all')) {
    pageList = pageList.slice(0, 5)
  }
  return (
    <div>
      <ul>
        {pageList.map((page) => (
          <li key={page.route}>
            <span> {page.date.slice(0, 10)} </span>
            &nbsp;
            <Link href={page.route}>{page.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

const Layout = () => {
  const { page } = usePageData()
  const { frontmatter } = page
  if (frontmatter.layout === 'home') {
    return <Theme.Layout afterDocContent={PostList()} />
  }
  return <Theme.Layout />
}

export default {
  ...Theme,
  Layout,
}

export * from 'rspress/theme'
