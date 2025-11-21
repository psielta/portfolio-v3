"use client";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import Link from "next/link";

const TITLE_TEXT = `
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 `;

export default function Home() {
	const healthCheck = useQuery(trpc.healthCheck.queryOptions());

	return (
		<div className="container mx-auto max-w-3xl px-4 py-2">
			<pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
			<div className="grid gap-6">
				<section className="rounded-lg border p-4">
					<h2 className="mb-2 font-medium">Status da API</h2>
					<div className="flex items-center gap-2">
						<div
							className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-green-500" : "bg-red-500"}`}
						/>
						<span className="text-sm text-muted-foreground">
							{healthCheck.isLoading
								? "Verificando..."
								: healthCheck.data
									? "Conectado"
									: "Desconectado"}
						</span>
					</div>
				</section>

				<section className="rounded-lg border p-4">
					<h2 className="mb-4 font-medium">Projetos</h2>
					<div className="grid gap-3">
						<Link
							href="/orbits"
							className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-accent"
						>
							<div>
								<h3 className="font-medium">Visualização de Mecânica Orbital</h3>
								<p className="text-sm text-muted-foreground">
									Visualização 3D interativa de órbitas planetárias
								</p>
							</div>
							<span className="text-2xl">🪐</span>
						</Link>

						<Link
							href="/todos"
							className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-accent"
						>
							<div>
								<h3 className="font-medium">Lista de Tarefas</h3>
								<p className="text-sm text-muted-foreground">
									Gerencie suas tarefas e afazeres
								</p>
							</div>
							<span className="text-2xl">✅</span>
						</Link>
					</div>
				</section>
			</div>
		</div>
	);
}
