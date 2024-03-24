export const baseURL = (() => {
  let protocol = "http";
  let url = "localhost:3000";
  if (process.env.VERCEL_URL) {
    protocol = "https";
    url = process.env.VERCEL_URL;
  } else if (process.env.VERCEL_BRANCH_URL) {
    protocol = "https";
    url = process.env.VERCEL_BRANCH_URL;
  } else if (typeof window !== "undefined" && window.location.host) {
    protocol = window.location.protocol;
    url = window.location.origin;
    return url;
  } else {
    protocol = "http";
    url = "localhost:3000";
  }

  return `${protocol}://${url}`;
})();
