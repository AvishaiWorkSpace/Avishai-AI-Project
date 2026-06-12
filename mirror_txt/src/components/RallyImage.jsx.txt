// Unified premium photo treatment. Every photo across the app passes through
// the same color grade so the imagery feels art-directed rather than stock:
//   · emerald multiply   → pulls all photos toward the brand hue
//   · gold soft-light     → warm "golden hour" highlight from the top
//   · bottom vignette     → keeps overlaid text legible
export default function RallyImage({ src, alt = '', className = '', grade = true, vignette = true }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover" />

      {grade && (
        <>
          <div className="absolute inset-0 bg-brand/20 mix-blend-multiply" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(115% 85% at 88% 0%, hsl(38 62% 60% / 0.32), transparent 55%)',
              mixBlendMode: 'soft-light',
            }}
          />
        </>
      )}

      {vignette && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
      )}
    </div>
  );
}
