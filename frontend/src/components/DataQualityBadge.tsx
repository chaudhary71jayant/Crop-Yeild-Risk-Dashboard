interface DataQualityBadgeProps {
  quality: string | null;
  driversAvailable?: number | null;
  showTooltip?: boolean;
}

const qualityDescriptions: Record<string, { desc: string; badgeClasses: string }> = {
  Complete: {
    desc: "All 4 historical driver signals computed (yield trend, rainfall anomaly, area trend, price volatility).",
    badgeClasses: "bg-blue-50 text-blue-800 border-blue-200"
  },
  Good: {
    desc: "3 of 4 driver signals available. Reliable score with re-normalized weights.",
    badgeClasses: "bg-teal-50 text-teal-800 border-teal-200"
  },
  Limited: {
    desc: "2 driver signals available (minimum threshold for scoring).",
    badgeClasses: "bg-yellow-50 text-yellow-800 border-yellow-200"
  },
  "Very Limited": {
    desc: "Only 1 driver signal available; insufficient signals to compute complete risk score.",
    badgeClasses: "bg-orange-50 text-orange-800 border-orange-200"
  },
  Insufficient: {
    desc: "0 driver signals available (early baseline year, e.g. 2021-22). Unscored.",
    badgeClasses: "bg-gray-100 text-gray-700 border-gray-300"
  }
};

export const DataQualityBadge = ({
  quality,
  driversAvailable,
  showTooltip = true
}: DataQualityBadgeProps) => {
  if (!quality) {
    return <span className="text-gray-400">—</span>;
  }

  const meta = qualityDescriptions[quality] ?? {
    desc: driversAvailable !== undefined && driversAvailable !== null
      ? `${driversAvailable} of 4 signals available.`
      : "Data quality indicator.",
    badgeClasses: "bg-gray-100 text-gray-700 border-gray-200"
  };

  const driversText =
    driversAvailable !== undefined && driversAvailable !== null
      ? ` (${driversAvailable}/4 signals)`
      : "";

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${meta.badgeClasses}`}
      title={showTooltip ? meta.desc : undefined}
    >
      {quality}
      {driversText}
    </span>
  );
};
