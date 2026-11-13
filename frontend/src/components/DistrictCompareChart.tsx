import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { District } from "../types/district";

interface DistrictCompareChartProps {
  districts: District[];
}

export const DistrictCompareChart = ({ districts }: DistrictCompareChartProps) => {
  const chartData = districts.map((d) => ({
    name: `${d.district} (${d.crop})`,
    state: d.state,
    year: d.year,
    risk_score: d.risk_score ?? 0,
    is_scored: d.risk_score !== null,
    yield_kg_ha: d.yield_kg_per_hectare ?? 0,
    rainfall_mm: d.rainfall_mm ?? 0
  }));

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-1 text-sm font-semibold text-slate-800">
        Risk Score Comparison
      </h3>
      <p className="mb-4 text-xs text-slate-500">
        Comparative view of computed risk scores (0–100) across selected districts
      </p>

      <div className="h-64 w-full" style={{ width: "100%", height: "260px", minHeight: "260px" }}>
        <ResponsiveContainer width="100%" height={260} minWidth={0} minHeight={200}>
          <BarChart
            data={chartData}
            margin={{ top: 12, right: 24, bottom: 24, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              label={{
                value: "Risk Score (0–100)",
                angle: -90,
                position: "insideLeft",
                fontSize: 11,
                fill: "#6b7280"
              }}
            />
            <Tooltip
              formatter={(value: any, name: any, item: any) => {
                if (name === "Risk score") {
                  return item.payload.is_scored
                    ? [`${Number(value).toFixed(1)} / 100`, "Risk score"]
                    : ["Unscored (—)", "Risk score"];
                }
                return [value, name];
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
            <Bar
              dataKey="risk_score"
              name="Risk score"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
