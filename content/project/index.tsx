import { Head } from "@rspress/core/runtime";
import { CardList, type CardProps } from "@theme";

const projects: CardProps[] = [
  {
    title: "推箱子",
    url: "https://www.vhcffh.com/project/sokoban/",
    github: "https://github.com/korbinZhang/sokoban",
    description: "使用Rust基于bevy游戏框架实现的推箱子游戏",
    icon: "📦",
  },
  {
    title: "五子棋",
    url: "https://www.vhcffh.com/project/gomoku/",
    github: "https://github.com/korbinZhang/gomoku",
    description: "使用js和Canvs实现的五子棋",
    icon: "⚫",
  },
  {
    title: "定时器",
    url: "https://www.vhcffh.com/project/timer/",
    github: "https://github.com/korbinZhang/timer",
    description: "使用Rust基于Yew和Trunk实现的定时器",
    icon: "⏲️",
  },
  {
    title: "语音转文本",
    url: "project/asr/",
    description: "使用cloudflare Work AI实现语音转文本",
    icon: "🎙️",
  },
];

export const frontmatter = {
  date: "2025-08-17",
  description: "一些个人项目",
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
      <CardList cards={projects} />
    </>
  );
};

export default ProjectList;
