import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useProactiveRefresh } from "@/hooks/auth/queries";

export function AuthInitializer() {
  const { isError } = useProactiveRefresh();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      logout();
      navigate("/login", { replace: true });
    }
  }, [isError]);

  return null;
}
