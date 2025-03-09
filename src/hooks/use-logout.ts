import { toast } from "./use-toast";

//logout hook
export const useLogout = () => {
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
      window.location.href = "/?from=logout";
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
