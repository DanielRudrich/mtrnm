/** @type {import('next').NextConfig} */
const nextConfig = {};
const path = require("path");
// module.exports = nextConfig;

module.exports = {
    webpack: (config, options) => {
        if (!options.isServer && !options.dev) {
            config.optimization.splitChunks = {
                chunks: (chunk) => {
                    // this may vary widely on your loader config
                    if (chunk.name && chunk.name.includes("worklet")) {
                        return false;
                    }

                    return true;
                },
            };
        }

        return config;
    },
};
