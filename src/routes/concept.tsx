import { createFileRoute } from "@tanstack/react-router";
import PanoramaViewer from "../components/PanoramaViewer";

export const Route = createFileRoute("/concept")({
	component: Concept,
});

function Concept() {
	return (
		<div className="relative w-full h-screen overflow-hidden bg-black">
			{/* React Three Fiber Canvas */}

			<PanoramaViewer
				imageSrc={"./output.png"}
				width={1920}
				height={800}
				fov={75}
				enableZoom={true}
				enablePan={true}
				enableDamping={false}
				dampingFactor={0.02}
				minDistance={0.1}
				maxDistance={2}
				onLoad={() => console.log("Panorama loaded!")}
				onError={(error) => console.error("Panorama error:", error)}
				className="main-panorama h-full w-full"
			/>
		</div>
	);
}
