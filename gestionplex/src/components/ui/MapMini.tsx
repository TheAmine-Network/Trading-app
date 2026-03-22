"use client";

interface MapMiniProps {
  lat: number;
  lng: number;
  label?: string;
  zoom?: number;
  className?: string;
}

export function MapMini({ lat, lng, label = "Localisation", zoom = 16, className = "" }: MapMiniProps) {
  const delta = 0.003;
  const src =
    `https://www.openstreetmap.org/export/embed.html` +
    `?bbox=${lng - delta},${lat - delta * 0.7},${lng + delta},${lat + delta * 0.7}` +
    `&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${className}`}
      style={{ border: "1px solid var(--border)" }}
    >
      <iframe
        src={src}
        title={label}
        width="100%"
        height="100%"
        style={{ border: 0, display: "block", minHeight: "inherit" }}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

// Satellite iframe (Google Maps, sans clé API)
export function SatelliteView({ lat, lng, label = "Vue satellite", className = "" }: Omit<MapMiniProps, "zoom">) {
  const src = `https://maps.google.com/maps?q=${lat},${lng}&t=k&z=19&output=embed`;
  return (
    <iframe
      src={src}
      title={label}
      width="100%"
      height="100%"
      style={{ border: 0, display: "block" }}
      loading="eager"
      referrerPolicy="no-referrer"
      className={className}
      allowFullScreen
    />
  );
}
