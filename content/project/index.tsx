import { Head } from '@rspress/core/runtime';

interface Project {
  title: string;
  url: string;
  github: string;
  description: string;
  icon: React.ReactNode;
}

const projects: Project[] = [
  {
    title: '推箱子',
    url: 'https://www.vhcffh.com/project/sokoban/',
    github: 'https://github.com/korbinZhang/sokoban',
    description: '使用Rust基于bevy游戏框架实现的推箱子游戏',
    icon: '📦',
  },
  {
    title: '定时器',
    url: 'https://www.vhcffh.com/project/timer/',
    github: 'https://github.com/korbinZhang/timer',
    description: '使用Rust基于Yew和Trunk实现的定时器',
    icon: '⏲️',
  },
  {
    title: '五子棋',
    url: 'https://www.vhcffh.com/project/gomoku/',
    github: 'https://github.com/korbinZhang/gomoku',
    description: '使用js和Canvs实现的五子棋',
    icon: '⚫',
  },
];

export const frontmatter = {
  date: '2025-08-17',
  description: '一些个人项目',
  title: "Korbin's project",
  footer: false,
};

const ProjectList: React.FC = () => {
  return (
    <>
      <Head>
        <meta name="description" content={frontmatter.description} />
        <meta property="og:description" content={frontmatter.description} />
      </Head>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 my-8">
        {projects.map((project) => (
          <div
            key={project.title}
            className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <div className="flex items-center mb-3">
              <div className="text-3xl mr-4 flex-shrink-0">{project.icon}</div>
              <div className="text-xl font-semibold m-0">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {project.title}
                </a>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
              {project.description}
            </p>
            <div className="flex gap-3">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                在线演示
              </a>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                GitHub 源码
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProjectList;
