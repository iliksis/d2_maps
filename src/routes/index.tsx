import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div className="p-2">
			<h3>Hello there!</h3>
			<p>Concept for a Destiny 2 Street View panorama viewer</p>
			<hr />
			<div className="m-7 flex gap-2">
				<Link
					to="/concept"
					className="flex h-10 w-30 items-center justify-center rounded-md border-2 border-white shadow-white transition-all hover:shadow"
				>
					Concept
				</Link>
				<Link
					to="/maps"
					className="flex h-10 w-30 items-center justify-center rounded-md border-2 border-white shadow-white transition-all hover:shadow"
				>
					Maps
				</Link>
			</div>
		</div>
	);
}
