interface TagPillProps {
  label: string;
  icon?: React.ReactNode;
  tone?: 'neutral' | 'orange' | 'green';
}

export default function TagPill({ label, icon, tone = 'neutral' }: TagPillProps) {
  const toneClasses = {
    neutral: 'border-black/15 bg-zneako-cream text-black/70',
    orange: 'border-transparent bg-zneako-orange text-zneako-black',
    green: 'border-transparent bg-zneako-green-deep text-white shadow-sm shadow-zneako-green-deep/20',
  }[tone];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-body text-xs tracking-[0.15em] uppercase ${toneClasses}`}
    >
      {label}
      {icon &&
        (tone === 'green' ? (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/15 ring-1 ring-white/25">
            {icon}
          </span>
        ) : (
          icon
        ))}
    </span>
  );
}
