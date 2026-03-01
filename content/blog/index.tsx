import { usePages } from '@rspress/core/runtime';

const Archives = () => {
  const { pages } = usePages();
  const getDateString = (date: Date) =>
    `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDay().toString().padStart(2, '0')}`;
  const blogPages = pages
    .map((page) => ({
      date: new Date(page.frontmatter.date as string),
      title: page.title,
      route: `${page.routePath}.html`,
    }))
    .filter(
      (page) =>
        page.date.getFullYear() > 2000 &&
        page.date.getFullYear() <= new Date().getFullYear() &&
        page.title !== '' &&
        page.route.startsWith('/blog'),
    )
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 20)
    .map((page) => (
      <li key={page.route}>
        <a href={page.route}>
          <time>{`${getDateString(page.date)}: `}</time> {page.title}
        </a>
      </li>
    ));

  return (
    <div>
      <h1>最新文章</h1>
      <ol>{blogPages}</ol>
    </div>
  );
};

export const frontmatter = {
  date: '2024-12-28',
  description: '一个简单的个人博客，用于记录笔记',
  title: "Korbin's blog",
  sidebar: false,
  footer: false,
};

export default Archives;
