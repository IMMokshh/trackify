"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Flame } from "lucide-react";

interface Issue {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  latitude: number;
  longitude: number;
  location_description?: string;
}

interface AdminMapProps {
  issues: Issue[];
}

// Priority → color mapping
const PRIORITY_COLORS: Record<string, string> = {
  low: "#22c55e",      // green
  medium: "#eab308",   // yellow
  high: "#f97316",     // orange
  critical: "#ef4444", // red
};

// Priority → heatmap intensity
const PRIORITY_INTENSITY: Record<string, number> = {
  low: 0.2,
  medium: 0.4,
  high: 0.7,
  critical: 1.0,
};

function createColoredIcon(L: any, color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:14px;height:14px;
      background:${color};
      border:2px solid white;
      border-radius:50%;
      box-shadow:0 2px 6px rgba(0,0,0,0.35);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

export default function AdminMap({ issues }: AdminMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const heatLayerRef = useRef<any>(null);
  const [showHeat, setShowHeat] = useState(false);
  const [heatReady, setHeatReady] = useState(false);

  const validIssues = issues.filter(
    (i) => i.latitude && i.longitude && !isNaN(i.latitude) && !isNaN(i.longitude)
  );

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import("leaflet").then(async (L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      // Guard against double-init (React strict mode)
      if ((mapRef.current as any)._leaflet_id) return;

      // Center on first issue or Kharghar default
      const center: [number, number] =
        validIssues.length > 0
          ? [validIssues[0].latitude, validIssues[0].longitude]
          : [19.044, 73.06];

      const map = L.map(mapRef.current!, { zoomControl: true }).setView(center, 15);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Add colored markers for each issue
      validIssues.forEach((issue) => {
        const color = PRIORITY_COLORS[issue.priority] || "#6366f1";
        const icon = createColoredIcon(L, color);

        const marker = L.marker([issue.latitude, issue.longitude], { icon }).addTo(map);

        const statusBadge = `<span style="
          display:inline-block;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;
          background:${issue.status === "resolved" ? "#dcfce7" : issue.status === "in_progress" ? "#fef9c3" : "#fee2e2"};
          color:${issue.status === "resolved" ? "#166534" : issue.status === "in_progress" ? "#854d0e" : "#991b1b"};
        ">${issue.status}</span>`;

        marker.bindPopup(`
          <div style="min-width:180px;font-family:sans-serif;">
            <p style="font-weight:700;font-size:14px;margin:0 0 6px">${issue.title}</p>
            <p style="font-size:12px;color:#6b7280;margin:0 0 4px">Category: ${issue.category || "General"}</p>
            <p style="font-size:12px;margin:0 0 6px">Priority: <strong style="color:${color}">${issue.priority}</strong></p>
            ${statusBadge}
            ${issue.location_description ? `<p style="font-size:11px;color:#9ca3af;margin:6px 0 0">${issue.location_description.slice(0, 80)}...</p>` : ""}
          </div>
        `);
      });

      // Build heatmap data
      try {
        await import("leaflet.heat" as any);
        const heatData = validIssues.map((i) => [
          i.latitude,
          i.longitude,
          PRIORITY_INTENSITY[i.priority] || 0.4,
        ]);
        const heat = (L as any).heatLayer(heatData, {
          radius: 30,
          blur: 20,
          maxZoom: 17,
          gradient: { 0.2: "#22c55e", 0.4: "#eab308", 0.7: "#f97316", 1.0: "#ef4444" },
        });
        heatLayerRef.current = heat;
        setHeatReady(true);
      } catch {
        // leaflet.heat unavailable — skip heatmap silently
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const toggleHeatmap = () => {
    if (!heatLayerRef.current || !mapInstanceRef.current) return;
    if (showHeat) {
      heatLayerRef.current.removeFrom(mapInstanceRef.current);
    } else {
      heatLayerRef.current.addTo(mapInstanceRef.current);
    }
    setShowHeat((v) => !v);
  };

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-indigo-500" />
          <span>{validIssues.length} issues mapped</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="hidden md:flex items-center gap-3 text-xs text-gray-500">
            {Object.entries(PRIORITY_COLORS).map(([p, c]) => (
              <span key={p} className="flex items-center gap-1">
                <span style={{ background: c }} className="w-2.5 h-2.5 rounded-full inline-block" />
                {p}
              </span>
            ))}
          </div>
          {heatReady && (
            <button
              onClick={toggleHeatmap}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                showHeat
                  ? "bg-orange-100 text-orange-700 border border-orange-300"
                  : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-orange-50"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              {showHeat ? "Hide Heatmap" : "Show Heatmap"}
            </button>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <div ref={mapRef} style={{ height: "420px", width: "100%" }} />
      </div>

      {validIssues.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-2">
          No issues with location data yet
        </p>
      )}
    </div>
  );
}
