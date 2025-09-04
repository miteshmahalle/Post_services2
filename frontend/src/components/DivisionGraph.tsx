import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { divisionDashboard } from "../api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import "./style/divisionGraph.css";


// ✅ Column options
const allowedColumns = [
  { value: "energy_bill", label: "Energy Bill" },
  { value: "energy_kwh", label: "Energy (kWh)" },
  { value: "fuel_litres", label: "Fuel (Litres)" },
  { value: "paper_reams", label: "Paper (Reams)" },
  { value: "waste_kg", label: "Waste (Kg)" },
  { value: "water_litres", label: "Water (Litres)" },
  { value: "training_hours", label: "Training Hours" },
  { value: "complaints_count", label: "Complaints Count" },
];

const labels: Record<string, string> = {
  energy_bill: "Energy Bill",
  energy_kwh: "Energy (kWh)",
  fuel_litres: "Fuel (Litres)",
  paper_reams: "Paper (Reams)",
  waste_kg: "Waste (Kg)",
  water_litres: "Water (Litres)",
  training_hours: "Training Hours",
  complaints_count: "Complaints Count",
};

// ✅ Number formatter (compact, e.g., 1.2K)
const numberFmt = (n: number) => {
  if (n === null || n === undefined || isNaN(n)) return "-";
  return Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(n);
};

// ✅ Month formatter
const formatMonthLabel = (raw: any, full: boolean = false): string => {
  if (!raw) return "";
  const d = new Date(raw);
  if (!isNaN(d.getTime())) {
    return d.toLocaleString("default", {
      month: full ? "short" : "short",
      year: full ? "numeric" : undefined,
    });
  }
  return String(raw);
};

// ✅ Custom Tooltip
// ✅ Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-month">{formatMonthLabel(label, true)}</div>
      <div className="tooltip-value">{numberFmt(Number(payload[0].value))}</div>
    </div>
  );
};


export default function DivisionGraph() {
  const token = useSelector((state: any) => state.auth.token);
  const [selectedColumn, setSelectedColumn] = useState("energy_bill");
  const [rows, setRows] = useState<
    { reporting_month: string; avg_value: number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch data
  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      try {
        const res = await divisionDashboard.getGraph(token, selectedColumn);
        if (
          res &&
          typeof res === "object" &&
          "data" in res &&
          Array.isArray((res as any).data)
        ) {
          setRows((res as any).data);
        } else {
          setRows([]);
        }
      } catch (err) {
        console.error("Graph fetch failed", err);
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedColumn, token]);

  // ✅ Transform data
  const data = useMemo(
    () =>
      (rows || []).map((r) => {
        const d = new Date(r.reporting_month);
        return {
          month: !isNaN(d.getTime())
            ? d.toLocaleString("default", { month: "short" })
            : r.reporting_month,
          value: Number(r.avg_value) || 0,
          raw: r.reporting_month, // keep full for tooltip
        };
      }),
    [rows]
  );

  return (
    <div className="division-graph">
      {/* Header */}
      <div className="graph-header">
        <h2 className="graph-title">Division ESG Trend</h2>
        <div className="graph-filter">
          <label htmlFor="esg-filter" className="filter-label">
            Filter by:
          </label>
          <select
            id="esg-filter"
            className="filter-select"
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
          >
            {allowedColumns.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Graph */}
      <div className="graph-card">
        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Loading data…</p>
          </div>
        ) : data.length === 0 ? (
          <div className="graph-empty">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart
              data={data}
              margin={{ top: 16, right: 24, bottom: 16, left: 0 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e54646ff" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#f63b3bff" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#374151", fontSize: 12 }}
              />
              <YAxis
                tickFormatter={numberFmt}
                tick={{ fill: "#374151", fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const rawDate = payload[0].payload.raw;
                  return (
                    <CustomTooltip
                      active={active}
                      payload={payload}
                      label={rawDate}
                    />
                  );
                }}
                cursor={{ fill: "rgba(59,130,246,0.06)" }}
              />
              <Legend />
              <Bar
                dataKey="value"
                name={labels[selectedColumn] || "Value"}
                fill="url(#barGradient)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
