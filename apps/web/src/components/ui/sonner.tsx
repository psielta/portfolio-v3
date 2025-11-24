"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			theme="dark"
			className="toaster group"
			toastOptions={{
				style: {
					background: 'rgba(0, 0, 0, 0.8)',
					backdropFilter: 'blur(16px)',
					border: '1px solid rgba(255, 255, 255, 0.1)',
					color: 'rgba(255, 255, 255, 0.9)',
					borderRadius: '12px',
					padding: '16px',
					boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
				},
				classNames: {
					success: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30',
					error: 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/30',
					info: 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30',
					warning: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
