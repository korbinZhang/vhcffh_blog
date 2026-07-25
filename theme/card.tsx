export type CardProps = {
  title: string;
  url: string;
  description: string;
  icon: string;
  github?: string;
};

export const CardList = (props: { cards: CardProps[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 my-8">
      {props.cards.map((card) => (
        <div
          key={card.title}
          className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
        >
          <div className="flex items-center mb-3">
            <div className="text-3xl mr-4 flex-shrink-0">{card.icon}</div>
            <div className="text-xl font-semibold m-0">
              <a
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {card.title}
              </a>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
            {card.description}
          </p>
          <div className="flex gap-3">
            <a
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              在线演示
            </a>
            {card.github && (
              <a
                href={card.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                GitHub 源码
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
