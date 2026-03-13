"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useCallback, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LocationData {
  address: string;
  lat: number;
  lng: number;
}

interface FreeMapPickerProps {
  onAddressSelect: (data: LocationData) => void;
  initialLocation?: LocationData | null;
}

// ─── Custom Marker Icon ──────────────────────────────────────────────────────

const pinIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 40" width="28" height="40">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.27 21.73 0 14 0z" fill="#EC4899" stroke="white" stroke-width="1.5"/>
    <circle cx="14" cy="14" r="5.5" fill="white"/>
    <circle cx="14" cy="14" r="3" fill="#EC4899"/>
  </svg>`,
  className: "",
  iconSize: [28, 40],
  iconAnchor: [14, 40],
});

// ─── Helper Components ───────────────────────────────────────────────────────

// Component to handle map clicks
function ClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to programmatically move map view
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function FreeMapPicker({ onAddressSelect, initialLocation }: FreeMapPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : null
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>([13.7367, 100.5231]); // Default to Bangkok
  const [zoom, setZoom] = useState(6);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search Address (Geocoding)
  const handleSearch = async (query: string) => {
    if (!query || query.length < 3) return;
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=th&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Select Suggestion
  const handleSelectSuggestion = (item: any) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const address = item.display_name;
    
    setMarkerPos([lat, lng]);
    setMapCenter([lat, lng]);
    setZoom(16);
    setSearchQuery(address);
    setShowSuggestions(false);
    onAddressSelect({ address, lat, lng });
  };

  // Handle Map Click (Reverse Geocoding)
  const handleMapClick = async (lat: number, lng: number) => {
    setMarkerPos([lat, lng]);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      const address = data.display_name || "Unknown address";
      setSearchQuery(address);
      onAddressSelect({ address, lat, lng });
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      onAddressSelect({ address: "เลือกตำแหน่งบนแผนที่", lat, lng });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search Input */}
      <div className="relative" ref={searchRef}>
        <label className="block text-[13px] font-bold text-n-800 mb-2">
          ค้นหาที่ตั้งโรงงาน
        </label>
        <div className="relative">
          <input
            type="text"
            className="w-full bg-white border-2 border-n-200 rounded-[9px] px-4 py-2.5 pl-10 text-[14px] font-medium text-n-800 outline-none focus:border-p-400 transition-colors"
            placeholder="พิมพ์ที่อยู่ เช่น ถนนสุขุมวิท, ปทุมวัน..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-n-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          {isSearching && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-p-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Suggestions List */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-[1001] w-full mt-1 bg-white border border-n-100 rounded-[9px] shadow-lg max-h-[200px] overflow-y-auto">
            {suggestions.map((item, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-p-50 border-b border-n-50 last:border-0 transition-colors"
                onClick={() => handleSelectSuggestion(item)}
              >
                <p className="font-medium text-n-800 truncate">{item.display_name}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative z-0 h-[300px] w-full rounded-[12px] overflow-hidden border-2 border-n-100">
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <ChangeView center={mapCenter} zoom={zoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onLocationChange={handleMapClick} />
          {markerPos && <Marker position={markerPos} icon={pinIcon} />}
        </MapContainer>
      </div>
    </div>
  );
}
