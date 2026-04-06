"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { SOCIETY_CENTER } from "@/data/wards";
import { detectWard, WardResult } from "@/lib/wardDetection";

export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  ward: WardResult | null;
}

interface LocationPickerProps {
  onChange: (data: LocationData) => void;
  initialLat?: number;
  initialLng?: number;
}

// Debounce helper
function debounce<T extends (...args: any[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}

export default function LocationPicker({ onChange, initialLat, initialLng }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [address, setAddress] = useState("Fetching location...");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [ward, setWard] = useState<WardResult | null>(null);

  // Reverse geocode using Nominatim
  const reverseGeocode = debounce(async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { "Accept-Language": "en", "User-Agent": "TrackifySocietyApp/1.0" } }
      );
      if (!res.ok) throw new Error("Geocode failed");
      const data = await res.json();
      const displayName = data.display_name || "Location selected";
      setAddress(displayName);

      const detectedWard = detectWard(lat, lng);
      setWard(detectedWard);

      onChange({ lat, lng, address: displayName, ward: detectedWard });
    } catch {
      // Retry once
      try {
        await new Promise((r) => setTimeout(r, 500));
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          { headers: { "Accept-Language": "en", "User-Agent": "TrackifySocietyApp/1.0" } }
        );
        const data = await res.json();
        const displayName = data.display_name || "Location selected";
        setAddress(displayName);
        const detectedWard = detectWard(lat, lng);
        setWard(detectedWard);
        onChange({ lat, lng, address: displayName, ward: detectedWard });
      } catch {
        setAddress("Location unavailable");
        onChange({ lat, lng, address: "Location unavailable", ward: detectWard(lat, lng) });
      }
    }
  }, 400);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically import Leaflet (no SSR)
    import("leaflet").then((L) => {
      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      // Guard against double-init (React strict mode)
      if ((mapRef.current as any)._leaflet_id) return;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const startLat = initialLat || SOCIETY_CENTER.lat;
      const startLng = initialLng || SOCIETY_CENTER.lng;

      const map = L.map(mapRef.current!, { zoomControl: true, scrollWheelZoom: true }).setView(
        [startLat, startLng],
        15
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([startLat, startLng], { draggable: true }).addTo(map);
      markerRef.current = marker;
      mapInstanceRef.current = map;

      // On drag end
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        reverseGeocode(pos.lat, pos.lng);
      });

      // On map click — reposition marker
      map.on("click", (e: any) => {
        marker.setLatLng(e.latlng);
        reverseGeocode(e.latlng.lat, e.latlng.lng);
      });

      // Try GPS
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            map.setView([latitude, longitude], 16);
            marker.setLatLng([latitude, longitude]);
            reverseGeocode(latitude, longitude);
            setStatus("ready");
          },
          () => {
            // GPS denied — use society center
            reverseGeocode(startLat, startLng);
            setStatus("ready");
          },
          { timeout: 8000 }
        );
      } else {
        reverseGeocode(startLat, startLng);
        setStatus("ready");
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-red-500" />
        Issue Location
      </label>

      {/* Map container */}
      <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 focus-within:border-red-400 transition-colors">
        {status === "loading" && (
          <div className="absolute inset-0 z-10 bg-gray-50 flex items-center justify-center gap-2 text-gray-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Fetching location...
          </div>
        )}
        <div ref={mapRef} style={{ height: "220px", width: "100%" }} />
      </div>

      {/* Address display */}
      <div className={`flex items-start gap-2 px-3 py-2 rounded-xl text-xs transition-all ${
        address === "Location unavailable"
          ? "bg-red-50 text-red-600 border border-red-200"
          : "bg-green-50 text-green-700 border border-green-200"
      }`}>
        {address === "Location unavailable" ? (
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        ) : (
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        )}
        <span className="leading-relaxed">{address}</span>
      </div>

      {/* Ward badge */}
      {ward && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
          <span className="font-semibold">Auto-routed to:</span>
          <span>{ward.ward_name}</span>
        </div>
      )}

      <p className="text-xs text-gray-400">Drag the pin or click the map to adjust location</p>
    </div>
  );
}
