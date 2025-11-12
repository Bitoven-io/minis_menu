import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import type { User } from "@shared/schema";

interface AuthResponse {
  user: Omit<User, "password">;
}

export function useAuth() {
  const { data, isLoading } = useQuery<AuthResponse | null>({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    user: data?.user ?? null,
    isLoading,
    isAuthenticated: !!data?.user,
  };
}
