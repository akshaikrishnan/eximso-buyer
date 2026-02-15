import { toast } from "./use-toast";
import { useQueryClient } from "@tanstack/react-query";

//logout hook
export const useLogout = () => {
  const queryClient = useQueryClient();

  const logout = async () => {
    toast({
      title: " Logging out",
      description: "Please wait...",
      variant: "default",
    });
    const res = await fetch(`/api/logout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (res.ok) {
      queryClient.clear();

      if (data.sellerLogoutUrl) {
        // Redirect through seller logout to clear seller-domain cookies,
        // then the seller logout will redirect back to buyer
        window.location.replace(data.sellerLogoutUrl);
      } else {
        window.location.replace("/?from=logout");
      }
      return data;
    } else {
      toast({
        title: "Error",
        description: data.message,
        variant: "destructive",
      });
      return data;
    }
  };
  return { logout };
};
