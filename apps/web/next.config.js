/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@oneguard/shared", "@oneguard/rules", "@oneguard/db"],
};

module.exports = nextConfig;
