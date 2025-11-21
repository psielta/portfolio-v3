"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
	const pathname = usePathname();

	const links = [
		{ to: "/", label: "Início" },
		{ to: "/orbits", label: "Órbitas" },
		{ to: "/todos", label: "Tarefas" },
	] as const;

	return (
		<div>
			<div className="flex flex-row items-center justify-between px-2 py-1">
				<nav className="flex gap-4 text-lg">
					{links.map(({ to, label }) => {
						const isActive = pathname === to;
						return (
							<Link
								key={to}
								href={to}
								className={`transition-colors hover:text-foreground/80 ${
									isActive
										? "text-foreground font-semibold border-b-2 border-primary"
										: "text-foreground/60"
								}`}
							>
								{label}
							</Link>
						);
					})}
				</nav>
				<div className="flex items-center gap-2">
					<ModeToggle />
				</div>
			</div>
			<hr />
		</div>
	);
}
