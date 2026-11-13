interface RiskScoreBadgeProps {
  score: number | null;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const getRiskCategory = (score: number | null): {
  label: string;
  category: "low" | "medium" | "high" | "unscored";
  classes: string;
  dotColor: string;
} => {
  if (score === null || Number.isNaN(score)) {
    return {
      label: "Unscored",
      category: "unscored",
      classes: "bg-gray-100 text-gray-700 border-gray-300",
      dotColor: "bg-gray-400"
    };
  }
  if (score < 34) {
    return {
      label: "Low Risk",
      category: "low",
      classes: "bg-emerald-50 text-emerald-800 border-emerald-200",
      dotColor: "bg-emerald-500"
    };
  }
  if (score <= 66) {
    return {
      label: "Medium Risk",
      category: "medium",
      classes: "bg-amber-50 text-amber-800 border-amber-200",
      dotColor: "bg-amber-500"
    };
  }
  return {
    label: "High Risk",
    category: "high",
    classes: "bg-rose-50 text-rose-800 border-rose-200",
    dotColor: "bg-rose-500"
  };
};

export const RiskScoreBadge = ({
  score,
  size = "md",
  showLabel = true
}: RiskScoreBadgeProps) => {
  const { label, classes, dotColor } = getRiskCategory(score);

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs sm:text-sm font-medium",
    lg: "px-3 py-1.5 text-sm sm:text-base font-semibold"
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${classes} ${sizeClasses}`}
      title={
        score === null
          ? "Not enough historical data to compute risk score"
          : `${label}: ${score.toFixed(1)} / 100`
      }
    >
      <span className={`h-2 w-2 rounded-full ${dotColor}`} />
      <span>{score === null ? "—" : score.toFixed(1)}</span>
      {showLabel && <span className="opacity-75">· {label}</span>}
    </span>
  );
};
