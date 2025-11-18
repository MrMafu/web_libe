import { BorrowingProvider } from "@/api/contexts/borrowing-context";
import BorrowingsPage from "@/components/borrowings/borrowings";

export default function Users() {
  return (
    <BorrowingProvider>
      <BorrowingsPage />
    </BorrowingProvider>
  );
}