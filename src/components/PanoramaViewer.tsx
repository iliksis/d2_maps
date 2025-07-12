// PanoramaViewer.tsx
import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import "./PanoramaViewer.css";

interface PanoramaViewerProps {
	imageSrc: string;
	width?: number;
	height?: number;
	className?: string;
	fov?: number;
	autoRotate?: boolean;
	autoRotateSpeed?: number;
	enableZoom?: boolean;
	enablePan?: boolean;
	minDistance?: number;
	maxDistance?: number;
	enableDamping?: boolean;
	dampingFactor?: number;
	onLoad?: () => void;
	onError?: (error: Error) => void;
	onCameraChange?: (camera: THREE.PerspectiveCamera) => void;
}

interface PanoramaSphereProps {
	imageSrc: string;
	onLoad?: () => void;
	onError?: (error: Error) => void;
}

interface CameraControllerProps {
	onCameraChange?: (camera: THREE.PerspectiveCamera) => void;
}

// Loading component
const LoadingSpinner: React.FC = () => (
	<Html center>
		<div className="panorama-loader">
			<div className="loading-spinner"></div>
			<p>Loading panorama...</p>
		</div>
	</Html>
);

// Error component
const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
	<Html center>
		<div className="panorama-error">
			<p>Error: {message}</p>
		</div>
	</Html>
);

// Panorama sphere component
const PanoramaSphere: React.FC<PanoramaSphereProps> = ({
	imageSrc,
	onLoad,
}) => {
	const meshRef = useRef<THREE.Mesh>(null);

	// Load texture using drei's useTexture hook
	const texture = useTexture(imageSrc, (texture) => {
		// Configure texture settings
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(1, 1);
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		texture.flipY = true;
		onLoad?.();
	});

	return (
		<mesh ref={meshRef} scale={[-1, 1, 1]}>
			<sphereGeometry args={[500, 60, 40]} />
			<meshBasicMaterial map={texture} side={THREE.DoubleSide} />
		</mesh>
	);
};

// Camera controller component
const CameraController: React.FC<CameraControllerProps> = ({
	onCameraChange,
}) => {
	const { camera } = useThree();

	useFrame(() => {
		if (onCameraChange && camera instanceof THREE.PerspectiveCamera) {
			onCameraChange(camera);
		}
	});

	return null;
};

// Main panorama viewer component
const PanoramaViewer: React.FC<PanoramaViewerProps> = ({
	imageSrc,
	width = 800,
	height = 400,
	className = "",
	fov = 75,
	autoRotate = false,
	autoRotateSpeed = 0.5,
	enableZoom = true,
	enablePan = true,
	minDistance = 0.1,
	maxDistance = 2,
	enableDamping = true,
	dampingFactor = 0.05,
	onLoad,
	onError,
	onCameraChange,
}) => {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const handleLoad = () => {
		setIsLoading(false);
		setError(null);
		onLoad?.();
	};

	const handleError = (error: Error) => {
		setIsLoading(false);
		setError(error.message);
		onError?.(error);
	};

	return (
		<div
			className={`panorama-viewer ${className}`}
			style={{ width, height }}
		>
			<Canvas
				camera={{
					fov,
					aspect: width / height,
					near: 0.1,
					far: 1000,
					position: [0, 0, 0.1],
				}}
				gl={{
					antialias: true,
					alpha: false,
					preserveDrawingBuffer: true,
				}}
				onCreated={(state) => {
					state.gl.setPixelRatio(window.devicePixelRatio);
				}}
			>
				<Suspense fallback={<LoadingSpinner />}>
					{error ? (
						<ErrorDisplay message={error} />
					) : (
						<>
							<PanoramaSphere
								imageSrc={imageSrc}
								onLoad={handleLoad}
								onError={handleError}
							/>

							<OrbitControls
								enableZoom={enableZoom}
								enablePan={enablePan}
								enableDamping={enableDamping}
								dampingFactor={dampingFactor}
								minDistance={minDistance}
								maxDistance={maxDistance}
								target={[0, 0, 0]}
								autoRotate={autoRotate}
								autoRotateSpeed={autoRotateSpeed}
								enableRotate={true}
								rotateSpeed={-0.5}
								zoomSpeed={1.0}
								panSpeed={0.8}
								mouseButtons={{
									LEFT: THREE.MOUSE.ROTATE,
									MIDDLE: THREE.MOUSE.DOLLY,
									RIGHT: THREE.MOUSE.PAN,
								}}
								touches={{
									ONE: THREE.TOUCH.ROTATE,
									TWO: THREE.TOUCH.DOLLY_PAN,
								}}
							/>

							<CameraController onCameraChange={onCameraChange} />
						</>
					)}
				</Suspense>
			</Canvas>

			{/* Loading indicator */}
			{isLoading && (
				<div className="panorama-loading-overlay">
					<div className="loading-spinner"></div>
					<p>Loading panorama...</p>
				</div>
			)}

			{/* Instructions */}
			<div className="panorama-info">
				<span>
					{enablePan && "Drag to look around"}
					{enablePan && enableZoom && " • "}
					{enableZoom && "Scroll to zoom"}
				</span>
			</div>
		</div>
	);
};

export default PanoramaViewer;
