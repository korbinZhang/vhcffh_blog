interface Book {
  title: string;
  url: string;
  author?: string;
  cover?: string;
}

const books: Book[] = [
  {
    title: '100-gcc-tips',
    url: '100-gcc-tips',
  },
];

const BookList: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
      {books.map((book) => {
        return (
          <a
            key={book.title}
            className="relative bg-blue-500 m-2 pt-15 pb-35 rounded-lg hover:shadow-lg hover:-translate-y-1"
            href={`${book.url}/index.html`}
          >
            <span className="absolute left-0 top-0 w-2 h-full bg-black/30 rounded-l-lg" />
            <div className="ml-2 pl-2 bg-blue-300 h-20 line-clamp-5">
              {book.title}
            </div>
          </a>
        );
      })}
    </div>
  );
};

export const frontmatter = {
  date: '2025-08-17',
  description: '值得阅读的一些笔记',
  title: "Korbin's blog",
  sidebar: false,
  footer: false,
  outline: false,
};

export default BookList;
