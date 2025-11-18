import { BookProvider } from "@/api/contexts/book-context";
import BooksPage from "@/components/books/books";

export default function Users() {
  return (
    <BookProvider>
      <BooksPage />
    </BookProvider>
  );
}