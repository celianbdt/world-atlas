"use client";

// Leaflet CSS is imported once in globals.css — importing it here again would
// bundle it after our theme overrides and repaint the map grey/white.

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L, { DivIcon } from "leaflet";
import { useEffect, useMemo } from "react";
import type { AtlasPoint, Locale } from "@/lib/types";
import { CATEGORY_META, ALL_CATEGORY_COLOR } from "@/lib/types";

export interface FlyTarget {
  coords: [number, number];
  ts: number;
}

interface AtlasMapProps {
  points: AtlasPoint[];
  locale: Locale;
  onSelect: (p: AtlasPoint) => void;
  flyTarget?: FlyTarget | null;
}

function makeIcon(point: AtlasPoint): DivIcon {
  const meta = CATEGORY_META[point.category];
  const img = point.image
    ? `<img src="${point.image}" loading="lazy" alt="" draggable="false" onerror="this.remove()"/>`
    : "";
  const html = `<div class="atlas-marker" style="--marker-color:${meta.color}">${img}</div>`;
  return L.divIcon({
    html,
    className: "",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -20],
  });
}

function clusterIcon(cluster: any) {
  const count = cluster.getChildCount();
  const size = count < 10 ? 40 : count < 100 ? 52 : 66;
  return L.divIcon({
    html: `<div class="atlas-cluster" style="width:${size}px;height:${size}px"><span style="font-size:${
      size < 50 ? 13 : 15
    }px">${count}</span></div>`,
    className: "",
    iconSize: L.point(size, size, true),
  });
}

/* NOTE: do not call map.setMinZoom()/setZoom() after mount — it interrupts
   leaflet.markercluster's chunked loading and the group ends up empty.
   Viewport coverage is guaranteed statically: minZoom 3 = 2048px world, larger
   than any standard viewport, and maxBounds keeps panning inside the world. */
function MapSizeFix() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 50);
  }, [map]);
  return null;
}

function FlyTo({ target }: { target?: FlyTarget | null }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.flyTo(target.coords, Math.max(map.getZoom(), 7), { duration: 1.1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.ts]);
  return null;
}

export default function AtlasMap({ points, locale, onSelect, flyTarget }: AtlasMapProps) {
  const markers = useMemo(
    () =>
      points.map((p) => {
        const meta = CATEGORY_META[p.category];
        return (
          <Marker
            key={p.id}
            position={p.coordinates}
            icon={makeIcon(p)}
            eventHandlers={{ click: () => onSelect(p) }}
          >
            <Popup>
              <div
                className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: meta.color }}
              >
                {meta.label[locale]}
              </div>
              <div className="font-display text-base font-semibold" style={{ color: "#F4ECD8" }}>
                {p.name[locale]}
              </div>
              <div className="text-xs" style={{ color: "#8A7A56" }}>
                {p.region}
              </div>
            </Popup>
          </Marker>
        );
      }),
    [points, locale, onSelect],
  );

  return (
    <MapContainer
      center={[25, 10]}
      zoom={3}
      minZoom={3}
      maxZoom={18}
      maxBounds={[
        [-85, -180],
        [85, 180],
      ]}
      maxBoundsViscosity={1}
      className="h-screen w-screen"
      zoomControl={true}
      preferCanvas
    >
      <MapSizeFix />
      <FlyTo target={flyTarget} />
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · Tiles <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains={["a", "b", "c", "d"]}
        noWrap
      />
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={40}
        spiderfyOnMaxZoom
        showCoverageOnHover={false}
        iconCreateFunction={clusterIcon}
      >
        {markers}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
