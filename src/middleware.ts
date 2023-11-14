import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // TODO: When the translations are ready, add the 'es' locale
  // A list of all locales that are supported
  locales: ["en", "es"],

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: "en",
});

export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "_next", "docs" and all files with an extension (e.g. favicon.ico)
  matcher: ["/((?!api|docs|_next|.*\\..*).*)"],
};
