/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ttf|woff|woff2|eot)$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },
    });
    return config;
  },
};

export default nextConfig;
