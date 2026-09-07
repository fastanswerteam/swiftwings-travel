/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/*': ['node_modules/pdfkit/js/**/*'],
    },
  },
};

export default nextConfig;