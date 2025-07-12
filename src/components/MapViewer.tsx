import React from "react";
import * as L from "leaflet";
import {
	GeoJSON,
	ImageOverlay,
	MapContainer,
	useMapEvent,
} from "react-leaflet";
import { config, type Planet } from "./MapViewer.config";

import "leaflet/dist/leaflet.css";

export type IMapViewerProps = {
	planet: Planet;
};

export const MapViewer = ({ planet }: IMapViewerProps) => {
	const imageSrc = `/${planet}.webp`;

	const { zoom, position, bounds, geoData } = config[planet];

	const [showGeoData, setShowGeoData] = React.useState(false);

	return (
		<div className="h-screen w-screen overflow-hidden hover:cursor-grab active:cursor-grabbing">
			<MapContainer
				crs={L.CRS.Simple}
				center={position}
				zoom={zoom.default}
				maxZoom={zoom.max}
				minZoom={zoom.min}
				maxBounds={bounds}
				className="h-screen w-screen"
			>
				<ImageOverlay url={imageSrc} bounds={bounds} />
				{showGeoData &&
					geoData &&
					geoData.map((d, i) => (
						<GeoJSON
							key={`${d.type}-${i}`}
							data={d}
							style={{
								color: "var(--color-gray-700)",
								weight: 10,
								opacity: 0.3,
							}}
						/>
					))}
				<Debug />
			</MapContainer>
			<button
				className="absolute top-0 right-0 bg-white text-black"
				type="button"
				onClick={() => setShowGeoData(!showGeoData)}
			>
				Toggle GeoData
			</button>
		</div>
	);
};

const Debug = () => {
	useMapEvent("click", (ev) => {
		console.log(ev.latlng);
	});

	return null;
};
