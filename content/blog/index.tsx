import { Head, useDark, usePages } from '@rspress/core/runtime';

export const frontmatter = {
  date: '2024-12-28',
  description: '博客目录，展示最新的博客文章',
  title: "Korbin's blog",
  footer: false,
};

const Archives = () => {
  const { pages } = usePages();
  const blogPages = pages
    .map((page) => ({
      year: new Date(page.frontmatter.date as string).getFullYear(),
      month: new Date(page.frontmatter.date as string).getMonth(),
      date: new Date(page.frontmatter.date as string),
      title: page.title,
      route: page.routePath
    }))
    .filter((page) => page.year > 2000 && page.year <= new Date().getFullYear())
    .filter((page) => page.title !== '')
    .filter((page) => page.route.startsWith('/blog'))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  const isDark = useDark();
  const linkClassName = `rounded-lg ${isDark ? 'hover:bg-gray-700 hover:text-blue-300' : 'hover:bg-gray-100 hover:text-blue-600'}`;

  return (
    <>
      <Head>
        <meta name="description" content={frontmatter.description} />
        <meta property="og:description" content={frontmatter.description} />
      </Head>
      <div className="text-current font-mono">
        <h1 className="rspress-doc-title text-3xl mb-10 leading-10 tracking-tight font-semibold">
          最新文章
        </h1>
        {blogPages.slice(0, 10).map((page) => (
          <div key={page.title} className={linkClassName}>
            <a
              className="flex justify-between px-4 py-1"
              key={page.title}
              href={page.route}
            >
              <span className="text-nowrap truncate">{page.title}</span>
              <time className="text-nowrap">
                {`${page.year}-${(page.month + 1).toString().padStart(2, '0')}-${page.date.getDate().toString().padStart(2, '0')}`}
              </time>
            </a>
          </div>
        ))}
      </div>
    </>
  );
};

export default Archives;
