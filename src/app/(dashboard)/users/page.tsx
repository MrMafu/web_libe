import { UserProvider } from "@/api/contexts/user-context";
import UsersPage from "@/components/users/users";

export default function Users() {
  return (
    <UserProvider>
      <UsersPage />
    </UserProvider>
  );
}