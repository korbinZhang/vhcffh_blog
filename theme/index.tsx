import { usePage } from '@rspress/core/runtime';
import { Layout as BasicLayout } from '@rspress/core/theme-original';

const Layout = () => {
  const { page } = usePage();

  if (page.routePath.startsWith('/blog')) {
    if (page.frontmatter.sidebar === undefined) {
      page.frontmatter.sidebar = false;
    }
    if (page.frontmatter.outline === undefined) {
      page.frontmatter.outline = false;
    }
  }
  if (page.routePath.startsWith('/project')) {
    if (page.frontmatter.sidebar === undefined) {
      page.frontmatter.sidebar = false;
    }
    if (page.frontmatter.outline === undefined) {
      page.frontmatter.outline = false;
    }
  }

  if (page.routePath.startsWith('/tool')) {
    if (page.frontmatter.sidebar === undefined) {
      page.frontmatter.sidebar = false;
    }
    if (page.frontmatter.outline === undefined) {
      page.frontmatter.outline = false;
    }
  }


  return <BasicLayout />;
};

export { Layout };
export * from '@rspress/core/theme-original';
