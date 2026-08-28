interface TagPillProps {
  label: string;
  icon?: React.ReactNode;
  tone?: 'neutral' | 'gold';
}

export default function TagPill({ label, icon, tone = 'neutral' }: TagPillProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-body text-xs tracking-[0.15em] uppercase ${
        tone === 'gold'
          ? 'border-transparent bg-zneako-gold text-zneako-black'
          : 'border-zneako-sand/25 bg-zneako-rubber/40 text-zneako-sand'
      }`}
    >
      {label}
      {icon}
    </span>
  );
}
