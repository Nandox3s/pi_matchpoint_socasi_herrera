/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  // El backend MatchPoint corre en HTTP puro; todas las llamadas salen desde
  // funciones serverless (servidor), nunca desde el navegador. Ver src/app/api/backend.
  poweredByHeader: false,
};

export default nextConfig;
