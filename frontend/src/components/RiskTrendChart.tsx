import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { District } from "../types/district";

interface RiskTrendChartProps {
  trend: District[];
}

export const RiskTrendChart = ({ trend }: RiskTrendChartProps) => {
  const scoredYears = trend.filter((t) => t.risk_score !== null);

  if (scoredYears.length < 2) {
    return (
      <p className="text-sm text-gray-600">
        Not enough scored years to show a trend.
      </p>
    );
  }

  return (
    <div className="h-72 w-full min-h-[288px]" style={{ width: "100%", height: "288px", minHeight: "288px" }}>
      <ResponsiveContainer width="100%" height={280} minWidth={0} minHeight={250}>
        <LineChart
          data={trend}
          margin={{ top: 12, right: 24, bottom: 8, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="year" stroke="#6b7280" />
          <YAxis domain={[0, 100]} stroke="#6b7280" />
          <Tooltip
            formatter={(value: any) =>
              typeof value === "number" ? `${value.toFixed(1)} / 100` : "—"
            }
          />
          <Line
            type="monotone"
            dataKey="risk_score"
            name="Risk score"
            stroke="#dc2626"
            strokeWidth={2}
            dot={{ r: 5, fill: "#dc2626" }}
            activeDot={{ r: 7 }}
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};