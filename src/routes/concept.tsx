import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export const Route = createFileRoute("/concept")({
	component: Concept,
});

function Concept() {
	const [rotation, setRotation] = React.useState({ x: 0, y: 0 });

	const mouseRef = React.useRef({ x: 0, y: 0, isDown: false });
	const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
		mouseRef.current.isDown = true;
		mouseRef.current.x = event.clientX;
		mouseRef.current.y = event.clientY;
		canvas.current?.style.setProperty("cursor", "grabbing");
	};

	const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		if (!mouseRef.current.isDown) return;

		const deltaX = event.clientX - mouseRef.current.x;
		const deltaY = event.clientY - mouseRef.current.y;

		setRotation((prev) => {
			const newY = prev.y + deltaX * 0.005;
			const newX = Math.max(
				-Math.PI / 2,
				Math.min(Math.PI / 2, prev.x + deltaY * 0.005)
			);

			return { x: newX, y: newY };
		});

		mouseRef.current.x = event.clientX;
		mouseRef.current.y = event.clientY;
	};

	const handleMouseUp = () => {
		mouseRef.current.isDown = false;
		canvas.current?.style.setProperty("cursor", "grab");
	};

	// Touch event handlers
	const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
		if (event.touches.length === 1) {
			mouseRef.current.isDown = true;
			mouseRef.current.x = event.touches[0].clientX;
			mouseRef.current.y = event.touches[0].clientY;
		}
	};

	const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
		if (!mouseRef.current.isDown || event.touches.length !== 1) return;

		event.preventDefault();

		const deltaX = event.touches[0].clientX - mouseRef.current.x;
		const deltaY = event.touches[0].clientY - mouseRef.current.y;

		setRotation((prev) => {
			const newY = prev.y + deltaX * 0.005;
			const newX = Math.max(
				-Math.PI / 2,
				Math.min(Math.PI / 2, prev.x + deltaY * 0.005)
			);

			return { x: newX, y: newY };
		});

		mouseRef.current.x = event.touches[0].clientX;
		mouseRef.current.y = event.touches[0].clientY;
	};

	const handleTouchEnd = () => {
		mouseRef.current.isDown = false;
	};

	// Wheel event for zooming
	const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
		event.preventDefault();
		// This will be handled by the parent component's zoom controls
	};

	const canvas = React.useRef<HTMLCanvasElement>(null);
	return (
		<div className="relative w-full h-screen overflow-hidden bg-black">
			{/* React Three Fiber Canvas */}
			<Canvas
				ref={canvas}
				camera={{
					fov: 75,
					position: [0, 0, 0],
					rotation: [0, 0, 0],
				}}
				gl={{ antialias: true }}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onMouseMove={handleMouseMove}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
				onWheel={handleWheel}
			>
				<React.Suspense fallback={null}>
					<PanoramaViewer rotation={rotation} />
				</React.Suspense>
			</Canvas>
		</div>
	);
}

const PanoramaViewer = ({
	rotation,
}: {
	rotation: { x: number; y: number };
}) => {
	const { camera } = useThree();
	useFrame(() => {
		if (camera) {
			camera.rotation.order = "YXZ";
			camera.rotation.y = rotation.y;
			camera.rotation.x = rotation.x;
		}
	});

	const texture = useTexture(
		"https://v0.dev/placeholder.svg?height=1024&width=2048"
	);

	return (
		<mesh>
			<sphereGeometry args={[500, 60, 40]} />
			<meshBasicMaterial map={texture} side={THREE.BackSide} />
		</mesh>
	);
};
