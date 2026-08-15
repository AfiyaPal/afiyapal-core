const marketingOnlyPaths = [
  "/login",
  "/register",
  "/password-reset",
  "/unauthorized",
  "/chatbot",
];

const marketingOnlyPrefixes = [
  "/dashboard",
  "/facility",
  "/admin",
];

export function shouldShowMarketingChrome(pathname: string): boolean {
  if (marketingOnlyPaths.includes(pathname)) return false;
  if (marketingOnlyPrefixes.some((p) => pathname.startsWith(p))) return false;
  return true;
}
