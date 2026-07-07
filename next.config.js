/** @type {import('next').NextConfig} */
const nextConfig = {
  // react-leaflet initializes the map imperatively in useEffect; StrictMode's
  // double-mount in dev makes Leaflet throw "Map container is already initialized"
  reactStrictMode: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "upload.wikimedia.org" }],
  },
};

module.exports = nextConfig;
