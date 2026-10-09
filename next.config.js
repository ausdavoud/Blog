const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

/** @type {import('next').NextConfig} */
const nextConfig = (phase) => ({
    output: phase === PHASE_DEVELOPMENT_SERVER ? undefined : "export",
    distDir: process.env.NEXT_DIST_DIR || ".next",
});

module.exports = nextConfig
