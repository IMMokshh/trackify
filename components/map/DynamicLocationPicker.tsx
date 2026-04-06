// Dynamic import wrapper — prevents Leaflet SSR crash in Next.js
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

export const DynamicLocationPicker = dynamic(
  () => import("./LocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] rounded-xl border-2 border-gray-200 flex items-center justify-center gap-2 text-gray-400 text-sm bg-gray-50">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading map...
      </div>
    ),
  }
);

export const DynamicAdminMap = dynamic(
  () => import("./AdminMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] rounded-2xl border border-gray-200 flex items-center justify-center gap-2 text-gray-400 text-sm bg-gray-50">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading map...
      </div>
    ),
  }
);
