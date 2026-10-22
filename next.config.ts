import type { NextConfig } from "next";

/* Photography under public/ was served with `max-age=0`, so every visit
   re-asked the server for every plate before painting it. The files are not
   content-hashed, so this is a month rather than "immutable": a replaced
   photograph reaches returning visitors within the month, or at once if it
   is given a new filename. */
const PHOTO_CACHE = "public, max-age=2592000, stale-while-revalidate=86400";
const PHOTO_DIRS = ["plates", "portraits", "udara", "bootcamp", "flyers", "foundation"];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return PHOTO_DIRS.map((dir) => ({
      source: `/${dir}/:path*`,
      headers: [{ key: "Cache-Control", value: PHOTO_CACHE }],
    }));
  },
};

export default nextConfig;
