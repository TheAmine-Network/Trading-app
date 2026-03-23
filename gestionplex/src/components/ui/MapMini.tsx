"use client";

interface MapMiniProps {
  lat: number;
  lng: number;
  label?: string;
  className?: string;
}

interface SatelliteViewProps {
  address: string;
  label?: string;
  className?: string;
}

// Mini carte OpenStreetMap — centrage par coordonnées (light, sans clé API)
export function MapMini({ lat, lng, label = "Localisation", className = "" }: MapMiniProps) {
  const delta = 0.003;
  const src =
    `https://www.openstreetmap.org/export/embed.html` +
    `?bbox=${lng - delta},${lat - delta * 0.7},${lng + delta},${lat + delta * 0.7}` +
    `&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div
      className={`overflow-hidden rounded-2xl ${className}`}
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

// Vue satellite Google Maps — géocode l'adresse réelle (sans clé API)
export function SatelliteView({ address, label = "Vue satellite", className = "" }: SatelliteViewProps) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=k&z=19&output=embed`;
  return (
    <iframe
      src={src}
      title={label}
      width="100%"
      height="100%"
      style={{ border: 0, display: "block" }}
      loading="lazy"
      referrerPolicy="no-referrer"
      className={className}
      allowFullScreen
    />
  );
}
