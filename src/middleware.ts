import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
    // Match all pathnames except static files and APIs
    matcher: [
        "/",
        "/(fr|en)/:path*",
        "/((?!_next|_vercel|api|.*\\..*).*)",
    ],
};
