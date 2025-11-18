import { FineProvider } from "@/api/contexts/fine-context";
import FinesPage from "@/components/fines/fines";

export default function Users() {
  return (
    <FineProvider>
      <FinesPage />
    </FineProvider>
  );
}