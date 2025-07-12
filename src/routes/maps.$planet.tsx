import { createFileRoute, notFound } from "@tanstack/react-router";
import { MapViewer } from "../components/MapViewer";
import { planets } from "../components/MapViewer.config";

export const Route = createFileRoute("/maps/$planet")({
	component: RouteComponent,
	loader: ({ params: { planet } }) => {
		if (typeof planet === "string" && planets.includes(planet)) {
			return;
		}
		notFound();
	},
	notFoundComponent: () => <div>Not found</div>,
});

function RouteComponent() {
	const { planet } = Route.useParams();
	return <MapViewer planet={planet} />;
}
