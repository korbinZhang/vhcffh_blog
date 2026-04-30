import { Head } from "@rspress/core/runtime";
import { CardList, type CardProps } from "@theme";

const tools: CardProps[] = [
  {
    title: "定时器",
    url: "https://www.vhcffh.com/project/timer/",
    github: "https://github.com/korbinZhang/timer",
    description: "使用Rust基于Yew和Trunk实现的定时器",
    icon: "⏲️",
  },
  {
    title: "语音转文本",
    url: "tool/asr/",
    description: "使用cloudflare Work AI实现语音转文本",
    icon: "🎙️",
  },
];

export const frontmatter = {
  date: "2025-08-17",
  description: "一些开发中经常使用的工具",
  title: "Korbin's tool",
  footer: false,
};

const ToolList = () => {
  return (
    <>
      <Head>
        <meta name="description" content={frontmatter.description} />
        <meta property="og:description" content={frontmatter.description} />
      </Head>
      <CardList cards={tools} />
    </>
  );
};

export default ToolList;
