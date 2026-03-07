import { useDark, usePages } from '@rspress/core/runtime';

const Archives = () => {
  const { pages } = usePages();
  const blogPages = pages
    .map((page) => ({
      year: new Date(page.frontmatter.date as string).getFullYear(),
      month: new Date(page.frontmatter.date as string).getMonth(),
      date: new Date(page.frontmatter.date as string),
      title: page.title,
      route: page.routePath.endsWith('/')
        ? `${page.routePath}index.html`
        : `${page.routePath}.html`,
    }))
    .filter((page) => page.year > 2000 && page.year <= new Date().getFullYear())
    .filter((page) => page.title !== '')
    .filter((page) => page.route.startsWith('/blog'))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  const isDark = useDark();
  const linkClassName = `rounded-lg ${isDark ? "hover:bg-gray-700 hover:text-blue-300" : "hover:bg-gray-100 hover:text-blue-600"}`;

  let lastYear = -1,
    docLists: React.ReactNode[] = [];
  for (const page of blogPages) {
    if (lastYear !== page.year) {
      lastYear = page.year;
      docLists.push(
        <h2
          className="mb-6 tracking-tight border-divider-light font-semibold"
          key={lastYear}
        >
          {lastYear}
        </h2>,
      );
    }
    docLists.push(
      <div className={linkClassName}>
        <a
          className="flex justify-between px-4 py-1"
          key={page.title}
          href={page.route}
        >
          <span className="text-nowrap truncate">{page.title}</span>
          <time className="text-nowrap">
            {(page.date.getMonth() + 1).toString().padStart(2, '0') +
              '-' +
              page.date.getDate().toString().padStart(2, '0')}
          </time>
        </a>
      </div>,
    );
  }
  return (
    <div className="text-current">
      <h1 className="rspress-doc-title text-3xl mb-10 leading-10 tracking-tight font-semibold">
        共计 {pages.length} 篇文章
      </h1>
      {docLists}
    </div>
  );
};

export const frontmatter = {
  date: '2024-12-28',
  description: '一个简单的个人博客，用于记录笔记',
  title: "Korbin's blog",
  footer: false,
};

export default Archives;
