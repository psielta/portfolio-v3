import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	// Configuração para suportar MDX
	pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
	// Configuração para otimizar imagens remotas se necessário
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
		],
	},
};

export default nextConfig;
