import type { GeoJSON } from "geojson";

export const planets = [
	"cosmodrome",
	"moon",
	"neomuna",
	"europa",
	"dreaming_city",
	"throne_world",
	"edz",
	"pale_heart",
];
export type Planet = (typeof planets)[number];

const cosmodromeDimensions = { x: 3038, y: 3339 } as const;
const moonDimensions = { x: 2594, y: 2779 } as const;
const neomunaDimensions = { x: 2897, y: 2415 } as const;
const europaDimensions = { x: 3652, y: 2911 } as const;
const dcityDimensions = { x: 2829, y: 2421 } as const;
const throneWorldDimensions = { x: 3950, y: 2855 } as const;
const edzDimensions = { x: 2710, y: 2377 } as const;
const paleHeartDimensions = { x: 8980, y: 2855 } as const;

type IConfig = {
	[key in Planet]: {
		zoom: {
			default: number;
			min: number;
			max: number;
		};
		position: Vector2;
		bounds: [number, number][];
		geoData?: GeoJSON[];
	};
};
export const config: IConfig = {
	cosmodrome: {
		zoom: {
			default: 1,
			min: 0,
			max: 2,
		},
		position: [cosmodromeDimensions.y / 2 / 2, cosmodromeDimensions.x / 2 / 2],
		bounds: [
			[0, 0],
			[cosmodromeDimensions.y / 2, cosmodromeDimensions.x / 2],
		],
		geoData: [
			{
				type: "LineString",
				coordinates: [
					[0, 0],
					[100, 50],
				],
			},
		],
	},
	moon: {
		zoom: {
			default: 1,
			min: 0,
			max: 2,
		},
		position: [moonDimensions.y / 2 / 2, moonDimensions.x / 2 / 2],
		bounds: [
			[0, 0],
			[moonDimensions.y / 2, moonDimensions.x / 2],
		],
	},
	neomuna: {
		zoom: {
			default: 1,
			min: 0,
			max: 2,
		},
		position: [neomunaDimensions.y / 2 / 2, neomunaDimensions.x / 2 / 2],
		bounds: [
			[0, 0],
			[neomunaDimensions.y / 2, neomunaDimensions.x / 2],
		],
	},
	europa: {
		zoom: {
			default: 1,
			min: 0,
			max: 2,
		},
		position: [europaDimensions.y / 2 / 2, europaDimensions.x / 2 / 2],
		bounds: [
			[0, 0],
			[europaDimensions.y / 2, europaDimensions.x / 2],
		],
	},
	dreaming_city: {
		zoom: {
			default: 1,
			min: 0,
			max: 2,
		},
		position: [dcityDimensions.y / 2 / 2, dcityDimensions.x / 2 / 2],
		bounds: [
			[0, 0],
			[dcityDimensions.y / 2, dcityDimensions.x / 2],
		],
	},
	throne_world: {
		zoom: {
			default: 1,
			min: 0,
			max: 2,
		},
		position: [
			throneWorldDimensions.y / 2 / 2,
			throneWorldDimensions.x / 2 / 2,
		],
		bounds: [
			[0, 0],
			[throneWorldDimensions.y / 2, throneWorldDimensions.x / 2],
		],
	},
	edz: {
		zoom: {
			default: 1,
			min: 0,
			max: 2,
		},
		position: [edzDimensions.y / 2 / 2, edzDimensions.x / 2 / 2],
		bounds: [
			[0, 0],
			[edzDimensions.y / 2, edzDimensions.x / 2],
		],
	},
	pale_heart: {
		zoom: {
			default: 1,
			min: 0,
			max: 2,
		},
		position: [paleHeartDimensions.y / 2 / 2, paleHeartDimensions.x / 2 / 2],
		bounds: [
			[0, 0],
			[paleHeartDimensions.y / 2, paleHeartDimensions.x / 2],
		],
	},
};

type Vector2 = [x: number, y: number];
