import { useState } from "react";

export const ScoreModelExplainer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
            ℹ
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              How the Risk Score & Advisory Engine Works
            </h3>
            <p className="text-xs text-slate-500">
              Explainable weighted rule-based model based on 4 historical adverse signals
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
        >
          {isOpen ? "Hide details ▲" : "Learn more ▼"}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-600 space-y-3">
          <div>
            <p className="font-medium text-slate-700 mb-1">
              Risk Score Scale (0 – 100):
            </p>
            <p>
              Higher scores indicate higher computed risk of agricultural yield loss. A score of{" "}
              <strong className="text-rose-600">67–100</strong> represents high risk,{" "}
              <strong className="text-amber-600">34–66</strong> moderate risk, and{" "}
              <strong className="text-emerald-600">0–33</strong> low risk.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="rounded bg-slate-50 p-2 border border-slate-100">
              <span className="font-semibold text-slate-800 block">Yield Trend</span>
              <span className="text-blue-600 font-bold">35%</span> weight
              <p className="text-[11px] text-slate-500 mt-0.5">Deviation from multi-year yield baseline</p>
            </div>
            <div className="rounded bg-slate-50 p-2 border border-slate-100">
              <span className="font-semibold text-slate-800 block">Rainfall Anomaly</span>
              <span className="text-blue-600 font-bold">30%</span> weight
              <p className="text-[11px] text-slate-500 mt-0.5">Deficit or severe anomaly vs normal precipitation</p>
            </div>
            <div className="rounded bg-slate-50 p-2 border border-slate-100">
              <span className="font-semibold text-slate-800 block">Area Trend</span>
              <span className="text-blue-600 font-bold">20%</span> weight
              <p className="text-[11px] text-slate-500 mt-0.5">Shift in cultivated acreage under the crop</p>
            </div>
            <div className="rounded bg-slate-50 p-2 border border-slate-100">
              <span className="font-semibold text-slate-800 block">Price Volatility</span>
              <span className="text-blue-600 font-bold">15%</span> weight
              <p className="text-[11px] text-slate-500 mt-0.5">Instability in local mandi price signals</p>
            </div>
          </div>

          <div className="rounded bg-amber-50 p-2.5 border border-amber-200 text-amber-900">
            <p className="font-medium">⚠️ Important note on Unscored years (—):</p>
            <p className="mt-0.5 text-[11px] text-amber-800 leading-relaxed">
              A dash (—) or null risk score means <em>not enough historical data exists</em> to compute time-series signals (early years like 2021-22 and 2022-23 serve as the baseline). A null score <strong>never means zero risk</strong>.
            </p>
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-1">Data Quality Ratings:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600">
              <li>• <strong>Complete:</strong> All 4 signals available and computed.</li>
              <li>• <strong>Good:</strong> 3 signals available; weights re-normalized.</li>
              <li>• <strong>Limited:</strong> 2 signals available (minimum dashboard threshold).</li>
              <li>• <strong>Very Limited / Insufficient:</strong> &lt; 2 signals; score withheld to maintain integrity.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
