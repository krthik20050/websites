"use client";

const BEST_FOR_ICONS: Record<string, string> = {
  "Weddings & Events": "💒",
  "Wedding photography": "💒",
  "Weddings": "💒",
  "Content Creation": "🎬",
  "Content creation": "🎬",
  "YouTube": "🎬",
  "Cinematography": "🎥",
  "Studio & Landscape": "🏔️",
  "Studio": "🏔️",
  "Landscape": "🏔️",
  "Standard Zoom": "📷",
  "Telephoto & Sports": "🏃",
  "Telephoto Action": "🏃",
  "Wildlife & Action": "🦅",
  "Wildlife": "🦅",
  "Portraits & Low-light": "🌙",
  "Portrait Photography": "🌙",
  "Portraits": "🌙",
  "Creative Portraits": "🎨",
  "Professional Weddings": "💒",
  "Beginners & Travel": "✈️",
  "Travel": "✈️",
  "Simplified": "✨",
  "Versatile Pro Use": "💪",
  "General use": "📸",
  "Sports & Events": "🏟️",
  "Sports": "🏟️",
  "Street & Travel": "🏙️",
  "Street": "🏙️",
  "Smooth gimbal video": "🎬",
  "Stabilized Video": "🎬",
  "Professional Filmmaking": "🎬",
  "Wedding films": "🎥",
  "Events": "📋",
  "Action": "⚡",
  "Pro Hybrid Work": "💼",
  "Wedding coverage": "💒",
  "Beginners": "🌟",
  "Landscape & Studio": "🏔️",
  "Wedding photography, events, portraits": "💒",
  "Hybrid photo/video, content creation, YouTube": "🎬",
  "Cinema, wedding films, music videos": "🎥",
  "Studio, product, and landscape photography": "🏔️",
  "Weddings, events, everyday professional use": "📷",
  "Sports, wildlife, portraits from distance": "🦅",
  "Portraits, low-light, creative photography": "🌙",
  "Professional portraits, fashion, headshots": "👔",
  "High-end weddings, commercial shoots, 8K production": "🎬",
  "Events, sports, general professional use": "💪",
  "Wedding coverage, events, documentary": "📋",
  "Sports, wildlife, portrait ceremonies": "🦅",
  "Portraits, low-light, artistic photography": "🎨",
  "Beginners, travel, family events": "✈️",
  "Professional wedding photography": "💒",
  "Wildlife, sports, action, landscape": "🦅",
  "General professional photography, events": "📋",
  "Landscape, studio, fine-art": "🏔️",
  "Street photography, travel, portrait": "🏙️",
  "Stabilized video": "🎬",
  "Smooth gimbal video, weddings, vlogs": "🎬",
  "Heavy cinema rigs, pro filmmaking": "🎥",
  "Event flash, wedding receptions": "⚡",
  "On-camera Flash": "⚡",
};

interface BestForSectionProps {
  specs: Record<string, string> | null;
  description: string | null;
  brand: string;
  model: string;
  category: string;
}

export function BestForSection({ specs, description, brand, model, category }: BestForSectionProps) {
  const bestFor = specs?.bestFor || specs?.bestFor || "";
  const mount = specs?.mount || "";
  const categoryLabel =
    category === "camera_body" ? "Camera Body" : category === "lens" ? "Lens" : category === "kit" ? "Kit" : "Accessory";

  const icon = bestFor ? (BEST_FOR_ICONS[bestFor] || BEST_FOR_ICONS[bestFor.split(",")[0]?.trim()] || "📸") : "📸";

  const useCases = bestFor.split(",").map((s) => s.trim()).filter(Boolean);

  // Extract key specs for highlight display
  const keySpecs: { label: string; value: string }[] = [];
  if (specs?.megapixels) keySpecs.push({ label: "Resolution", value: `${specs.megapixels} MP` });
  if (specs?.sensor) keySpecs.push({ label: "Sensor", value: specs.sensor });
  if (specs?.aperture) keySpecs.push({ label: "Aperture", value: specs.aperture });
  if (specs?.focalLength) keySpecs.push({ label: "Focal Length", value: specs.focalLength });
  if (specs?.isoRange) keySpecs.push({ label: "ISO Range", value: specs.isoRange });
  if (specs?.videoMax) keySpecs.push({ label: "Max Video", value: specs.videoMax });
  if (specs?.payload) keySpecs.push({ label: "Payload", value: specs.payload });
  if (specs?.batteryLife) keySpecs.push({ label: "Battery", value: specs.batteryLife });

  return (
    <div className="space-y-5">
      {/* Best For Highlight */}
      {bestFor && (
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">Best For</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {useCases.map((uc, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                  >
                    {uc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Specs Highlight */}
      {keySpecs.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {keySpecs.map((spec, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card p-3 text-center"
            >
              <p className="text-2xs font-semibold uppercase tracking-wider text-brand-400">{spec.label}</p>
              <p className="mt-1 text-sm font-bold text-foreground">{spec.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Mount/Compatibility */}
      {mount && (
        <div className="rounded-lg bg-surface-secondary p-3 text-sm">
          <span className="font-medium text-foreground">Mount: </span>
          <span className="text-brand-500">{mount}</span>
          {category === "lens" && (
            <p className="mt-1 text-xs text-brand-400">
              Compatible with all {mount} mount camera bodies
            </p>
          )}
          {category === "camera_body" && (
            <p className="mt-1 text-xs text-brand-400">
              Compatible with all {mount} mount lenses
            </p>
          )}
        </div>
      )}
    </div>
  );
}
