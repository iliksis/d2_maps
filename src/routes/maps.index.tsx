import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/maps/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-wrap gap-2 p-7">
			<Link
				to="/maps/$planet"
				params={{ planet: "cosmodrome" }}
				className="flex h-10 w-30 items-center justify-center rounded-md border border-white shadow-white transition-all hover:shadow"
			>
				Cosmodrome
			</Link>
			<Link
				to="/maps/$planet"
				params={{ planet: "moon" }}
				className="flex h-10 w-30 items-center justify-center rounded-md border border-white shadow-white transition-all hover:shadow"
			>
				Moon
			</Link>
			<Link
				to="/maps/$planet"
				params={{ planet: "dreaming_city" }}
				className="flex h-10 w-30 items-center justify-center rounded-md border border-white shadow-white transition-all hover:shadow"
			>
				Dreaming City
			</Link>
			<Link
				to="/maps/$planet"
				params={{ planet: "europa" }}
				className="flex h-10 w-30 items-center justify-center rounded-md border border-white shadow-white transition-all hover:shadow"
			>
				Europa
			</Link>
			<Link
				to="/maps/$planet"
				params={{ planet: "neomuna" }}
				className="flex h-10 w-30 items-center justify-center rounded-md border border-white shadow-white transition-all hover:shadow"
			>
				Neomuna
			</Link>
			<Link
				to="/maps/$planet"
				params={{ planet: "throne_world" }}
				className="flex h-10 w-30 items-center justify-center rounded-md border border-white shadow-white transition-all hover:shadow"
			>
				Throne World
			</Link>
			<Link
				to="/maps/$planet"
				params={{ planet: "edz" }}
				className="flex h-10 w-fit min-w-30 items-center justify-center rounded-md border border-white p-3 shadow-white transition-all hover:shadow"
			>
				European Dead Zone
			</Link>
			<Link
				to="/maps/$planet"
				params={{ planet: "pale_heart" }}
				className="flex h-10 w-30 items-center justify-center rounded-md border border-white shadow-white transition-all hover:shadow"
			>
				The Pale Heart
			</Link>
		</div>
	);
}
