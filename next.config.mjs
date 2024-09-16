/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators :{
        appIsrStatus : false
    },
  webpack(config) {
    // Add rule to ignore HTML files from node_modules
    config.module.rules.push({
      test: /\.html$/,
      use: "ignore-loader", // Use 'ignore-loader' to ignore HTML files
    });

    return config;
  },
};

export default nextConfig;
