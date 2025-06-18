import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div className="p-2">
			<h3>Hello there!</h3>
			<p>Concept for a Destiny 2 Street View panorama viewer</p>
		</div>
	);
}
