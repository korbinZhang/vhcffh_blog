import { Link } from "@theme";

interface Book {
  title: string;
  url: string;
  author?: string;
  cover?: string;
}

const books: Book[] = [
  {
    title: "100-gcc-tips",
    url: "100-gcc-tips",
  },
];

const BookList: React.FC = () => {
  return (
    <ol>
      {books.map((book) => {
        return (
          <li key={book.url}>
            <Link href={`book/${book.url}/`}>{book.url}</Link>
          </li>
        );
      })}
    </ol>
  );
};

export const frontmatter = {
  date: "2025-08-17",
  description: "值得阅读的一些笔记",
  title: "Korbin's book",
  sidebar: false,
  footer: false,
  outline: false,
};

export default BookList;
