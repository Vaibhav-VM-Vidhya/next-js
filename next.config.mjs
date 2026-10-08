/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    '192.168.31.96',
    '192.168.*.*',
    '192.168.31.*',
    '127.0.0.1',
    '*.local',
  ],
};

export default nextConfig;
