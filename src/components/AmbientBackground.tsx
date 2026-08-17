export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-obsidian pointer-events-none">
      <div className="blob animate-drift-1 -top-24 -left-24 w-[36rem] h-[36rem] bg-[#D98A4A]/20" />
      <div className="blob animate-drift-2 top-1/3 -right-32 w-[42rem] h-[42rem] bg-[#6B7685]/20" />
      <div className="blob animate-drift-3 -bottom-32 left-1/4 w-[38rem] h-[38rem] bg-[#D98A4A]/15" />
    </div>
  );
}
