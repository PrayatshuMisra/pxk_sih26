export function useAuth() {
  return {
    user: {
      role: "admin",
      openId: "mock-user-123",
      displayName: "Mock Provider"
    },
    isAuthenticated: true,
    loading: false
  };
}
