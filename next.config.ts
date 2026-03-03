import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "dx5lm1hjlc6z4xlc.private.blob.vercel-storage.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },
    allowedDevOrigins: ["*"],
};

export default nextConfig;
