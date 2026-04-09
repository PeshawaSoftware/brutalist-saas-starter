export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

const getAuthConfig = () => {
  const oauthPortalUrl = (import.meta.env.VITE_OAUTH_PORTAL_URL ?? "").trim();
  const appId = (import.meta.env.VITE_APP_ID ?? "").trim();

  return {
    oauthPortalUrl,
    appId,
    configured: oauthPortalUrl.length > 0 && appId.length > 0,
  };
};

export const isAuthConfigured = () => getAuthConfig().configured;

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = (): string | null => {
  if (typeof window === "undefined") return null;

  const { oauthPortalUrl, appId, configured } = getAuthConfig();
  if (!configured) {
    return null;
  }

  try {
    const redirectUri = `${window.location.origin}/api/oauth/callback`;
    const state = btoa(redirectUri);
    const url = new URL("/app-auth", oauthPortalUrl);

    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    return url.toString();
  } catch (error) {
    console.warn("[Auth] Failed to construct login URL.", error);
    return null;
  }
};

export const redirectToLogin = (fallbackUrl?: string): boolean => {
  if (typeof window === "undefined") return false;

  const loginUrl = getLoginUrl();
  const targetUrl = loginUrl ?? fallbackUrl ?? null;

  if (!targetUrl) {
    return false;
  }

  window.location.href = targetUrl;
  return true;
};
