export function syncTokensToStore(token: string, refreshToken: string): void {
  // Dynamic import avoids the circular dependency:
  // http.ts ← login store imports http ← http would import login store
  import("../stores/login.ts").then(({ useLoginStore }) => {
    const store = useLoginStore();
    store.token = token;
    store.refreshToken = refreshToken;
  });
}

export function clearSessionAndRedirect(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");

  import("../router/index.ts").then(({ router }) => {
    router.push({ name: "login" });
  });
}
