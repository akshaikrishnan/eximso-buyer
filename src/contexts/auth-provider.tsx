import { useAuth } from "@/hooks/use-auth";

export default function AuthProvider({ children }: any) {
  const { user, isLoggedIn, setDeviceToken } = useAuth();
  console.log(user, isLoggedIn);
  return <>{children}</>;
}
