import { DashboardHeader } from "@/components/dashboard-header";
import { useGetCasesByPriority, useGetEscalationByDepartment } from "@workspace/api-client-react";
import { CHART_COLORS } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CSVLink } from "@/components/ui/csv-link";
import { Download } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line } from "recharts";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div style={{ backgroundColor: "#fff", borderRadius: "6px", padding: "10px 14px", border: "1px solid #e0e0e0", color: "#1a1a1a", fontSize: "13px" }}>
      <div style={{ marginBottom: "6px", fontWeight: 500, display: "flex", alignItems: "center", gap: "6px" }}>{label}</div>
      {payload.map((entry: any, index: number) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" }}>
          {entry.color && <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", backgroundColor: entry.color, flexShrink: 0 }} />}
          <span style={{ color: "#444" }}>{entry.name}</span>
          <span style={{ marginLeft: "auto", fontWeight: 600 }}>{typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}</span>
        </div>
      ))}
    </div>
  );
}

function CustomLegend({ payload }: any) {
  if (!payload || payload.length === 0) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 16px", fontSize: "13px" }}>
      {payload.map((entry: any, index: number) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", backgroundColor: entry.color, flexShrink: 0 }} />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function PriorityPage() {
  const { data: priorityData, isLoading: priorityLoading, isFetching: priorityFetching, dataUpdatedAt } = useGetCasesByPriority();
  const { data: escData, isLoading: escLoading, isFetching: escFetching } = useGetEscalationByDepartment();
  
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "#e5e5e5";
  const tickColor = isDark ? "#98999C" : "#71717a";

  const loading = priorityLoading || priorityFetching || escLoading || escFetching;

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Priority & Escalation" 
        subtitle="Analyze case priorities and escalation rates across departments"
        lastRefreshedAt={dataUpdatedAt}
        loading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Priority Breakdown</CardTitle>
            {!loading && priorityData && priorityData.length > 0 && (
              <CSVLink data={priorityData} filename="priority-breakdown.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}>
                <Download className="w-3.5 h-3.5" />
              </CSVLink>
            )}
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="w-full h-[300px]" /> : (
              <ResponsiveContainer width="100%" height={300} debounce={0}>
                <BarChart data={priorityData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="priority" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                  <YAxis tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={false} />
                  <Bar dataKey="count" name="Case Count" fill={CHART_COLORS.blue} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} radius={[2, 2, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Escalation Rates by Department</CardTitle>
            {!loading && escData && escData.length > 0 && (
              <CSVLink data={escData} filename="escalation-rates.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}>
                <Download className="w-3.5 h-3.5" />
              </CSVLink>
            )}
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="w-full h-[300px]" /> : (
              <ResponsiveContainer width="100%" height={300} debounce={0}>
                <ComposedChart data={escData || []} layout="vertical" margin={{ left: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                  <YAxis dataKey="department" type="category" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} width={100} />
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={false} />
                  <Legend content={<CustomLegend />} />
                  <Bar dataKey="escalatedCases" name="Escalated Cases" fill={CHART_COLORS.red} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} radius={[0, 2, 2, 0]} isAnimationActive={false} />
                  <Line dataKey="escalationRate" name="Escalation Rate %" stroke={CHART_COLORS.purple} strokeWidth={2} dot={false} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
