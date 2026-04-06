// Mock ward GeoJSON boundaries for Greenwood Heights, Kharghar, Navi Mumbai
// Each ward is a polygon defined by [lng, lat] coordinate pairs

export interface Ward {
  id: string;
  code: string;
  name: string;
  adminEmail: string;
  polygon: [number, number][]; // [lng, lat]
}

export const WARDS: Ward[] = [
  {
    id: "ward-a",
    code: "GH-A",
    name: "Ward A — Buildings 1–4",
    adminEmail: "ward-a@greenwoodheights.in",
    polygon: [
      [73.0580, 19.0430],
      [73.0600, 19.0430],
      [73.0600, 19.0450],
      [73.0580, 19.0450],
      [73.0580, 19.0430],
    ],
  },
  {
    id: "ward-b",
    code: "GH-B",
    name: "Ward B — Buildings 5–8",
    adminEmail: "ward-b@greenwoodheights.in",
    polygon: [
      [73.0600, 19.0430],
      [73.0620, 19.0430],
      [73.0620, 19.0450],
      [73.0600, 19.0450],
      [73.0600, 19.0430],
    ],
  },
  {
    id: "ward-c",
    code: "GH-C",
    name: "Ward C — Common Areas",
    adminEmail: "ward-c@greenwoodheights.in",
    polygon: [
      [73.0580, 19.0450],
      [73.0620, 19.0450],
      [73.0620, 19.0470],
      [73.0580, 19.0470],
      [73.0580, 19.0450],
    ],
  },
];

// Society center fallback coordinates (Kharghar, Navi Mumbai)
export const SOCIETY_CENTER = { lat: 19.0440, lng: 73.0600 };
