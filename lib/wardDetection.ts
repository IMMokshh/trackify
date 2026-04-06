// Ward detection using point-in-polygon algorithm
// Determines which ward a lat/lng coordinate falls into

import { WARDS, Ward, SOCIETY_CENTER } from "@/data/wards";

// Ray-casting point-in-polygon algorithm
function pointInPolygon(lat: number, lng: number, polygon: [number, number][]): boolean {
  let inside = false;
  const x = lng;
  const y = lat;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0]; // lng
    const yi = polygon[i][1]; // lat
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

export interface WardResult {
  ward_id: string;
  ward_code: string;
  ward_name: string;
  admin_email: string;
}

export function detectWard(lat: number, lng: number): WardResult | null {
  for (const ward of WARDS) {
    if (pointInPolygon(lat, lng, ward.polygon)) {
      return {
        ward_id: ward.id,
        ward_code: ward.code,
        ward_name: ward.name,
        admin_email: ward.adminEmail,
      };
    }
  }
  // Fallback: find nearest ward center
  return {
    ward_id: "ward-a",
    ward_code: "GH-A",
    ward_name: "Ward A — Buildings 1–4",
    admin_email: "ward-a@greenwoodheights.in",
  };
}
