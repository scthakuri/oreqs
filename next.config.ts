import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/media/**',
            },
            {
                protocol: 'https',
                hostname: 'oreqs.com',
                pathname: '/media/**',
            },
        ],
        dangerouslyAllowSVG: true,
        unoptimized: process.env.NODE_ENV === 'development',
    }
};

export default nextConfig;
