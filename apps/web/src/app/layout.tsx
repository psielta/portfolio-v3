import { AppLayout } from "@/components/app-layout";
import Providers from "@/components/providers";
import ChatWidget from "@/components/chat/chat-widget";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../index.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Mateus Salgueiro Portfolio",
	description: "Portfolio profissional de Mateus Salgueiro, desenvolvedor full stack e arquiteto de sistemas",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR" suppressHydrationWarning className="h-full">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
			>
				<Providers>
					<AppLayout>{children}</AppLayout>
					<ChatWidget />
				</Providers>
			</body>
		</html>
	);
}
