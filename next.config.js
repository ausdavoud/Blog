/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    webpack: (config, { dev }) => {
        if (dev) config.watchOptions = { ...config.watchOptions, aggregateTimeout: 1000 };
        return config;
    }
};

module.exports = nextConfig