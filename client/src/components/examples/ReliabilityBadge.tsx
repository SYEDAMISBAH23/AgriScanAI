import ReliabilityBadge from "../ReliabilityBadge";

export default function ReliabilityBadgeExample() {
  return (
    <div className="flex gap-4 p-8">
      <ReliabilityBadge reliability="very_high" confidence={0.95} />
      <ReliabilityBadge reliability="high" confidence={0.82} />
      <ReliabilityBadge reliability="moderate" confidence={0.68} />
    </div>
  );
}
