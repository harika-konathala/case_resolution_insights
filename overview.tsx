import { DashboardHeader } from "@/components/dashboard-header";
import { KPICard } from "@/components/kpi-card";
import { useGetOverviewStats, useGetCasesOverTime, useGetCasesByStatus, useGetCasesByCategory } from "@workspace/api-client-react";
import { formatNumber, formatCurrency, formatPercent, CHART_COLORS, CHART_COLOR_LIST } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CSVLink } from "@/components/ui/csv-link";
import { Download } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from "recharts";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div style={{ backgroundColor: "#fff", borderRadius: "6px", padding: "10px 14px", border: "1px solid #e0e0e0", color: "#1a1a1a", fontSize: "13px" }}>
      <div style={{ marginBottom: "6px", fontWeight: 500, display: "flex", alignItems: "center", gap: "6px" }}>
        {payload.length === 1 && payload[0].color && payload[0].color !== "#ffffff" && (
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", backgroundColor: payload[0].color, flexShrink: 0 }} />
        )}
        {label}
      </div>
      {payload.map((entry: any, index: number) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" }}>
          {payload.length > 1 && entry.color && entry.color !== "#ffffff" && (
            <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", backgroundColor: entry.color, flexShrink: 0 }} />
          )}
          <span style={{ color: "#444" }}>{entry.name}</span>
          <span style={{ marginLeft: "auto", fontWeight: 600 }}>
            {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
          </span>
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

export default function OverviewPage() {
  const { data: stats, isLoading: statsLoading, isFetching: statsFetching, dataUpdatedAt } = useGetOverviewStats();
  const { data: overTime, isLoading: timeLoading, isFetching: timeFetching } = useGetCasesOverTime();
  const { data: statusData, isLoading: statusLoading, isFetching: statusFetching } = useGetCasesByStatus();
  const { data: categoryData, isLoading: categoryLoading, isFetching: categoryFetching } = useGetCasesByCategory();
  const { theme } = useTheme();
  
  const isDark = theme === "dark";
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "#e5e5e5";
  const tickColor = isDark ? "#98999C" : "#71717a";

  const loading = statsLoading || statsFetching || timeLoading || timeFetching || statusLoading || statusFetching || categoryLoading || categoryFetching;

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Overview" 
        subtitle="Key performance indicators and overall case volume"
        lastRefreshedAt={dataUpdatedAt}
        loading={loading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard title="Total Cases" value={stats ? formatNumber(stats.totalCases) : "--"} loading={statsLoading || statsFetching} />
        <KPICard title="Open Cases" value={stats ? formatNumber(stats.openCases) : "--"} loading={statsLoading || statsFetching} />
        <KPICard title="Resolved Cases" value={stats ? formatNumber(stats.resolvedCases) : "--"} loading={statsLoading || statsFetching} valueColor={CHART_COLORS.green} />
        <KPICard title="Escalated Cases" value={stats ? formatNumber(stats.escalatedCases) : "--"} loading={statsLoading || statsFetching} valueColor={CHART_COLORS.red} />
        <KPICard title="Avg Resolution Time" value={stats ? `${stats.avgResolutionHours.toFixed(1)} hrs` : "--"} loading={statsLoading || statsFetching} />
        <KPICard title="Avg CSAT Score" value={stats ? stats.avgSatisfactionScore.toFixed(2) : "--"} loading={statsLoading || statsFetching} />
        <KPICard title="Total Case Cost" value={stats ? formatCurrency(stats.totalCaseCost) : "--"} loading={statsLoading || statsFetching} />
        <KPICard title="SLA Breach Rate" value={stats ? formatPercent(stats.slaBreachRate) : "--"} loading={statsLoading || statsFetching} valueColor={CHART_COLORS.red} />
        <KPICard title="Escalation Rate" value={stats ? formatPercent(stats.escalationRate) : "--"} loading={statsLoading || statsFetching} valueColor={CHART_COLORS.red} />
        <KPICard title="Critical Open" value={stats ? formatNumber(stats.criticalOpenCases) : "--"} loading={statsLoading || statsFetching} valueColor={CHART_COLORS.red} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Case Volume Over Time</CardTitle>
            {!loading && overTime && overTime.length > 0 && (
              <CSVLink data={overTime} filename="cases-over-time.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }} aria-label="Export chart data as CSV">
                <Download className="w-3.5 h-3.5" />
              </CSVLink>
            )}
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="w-full h-[300px]" /> : (
              <ResponsiveContainer width="100%" height={300} debounce={0}>
                <AreaChart data={overTime || []}>
                  <defs>
                    <linearGradient id="gradientTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_COLORS.blue} stopOpacity={0.5} />
                      <stop offset="100%" stopColor={CHART_COLORS.blue} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="period" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                  <YAxis tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: 'rgba(0,0,0,0.05)', stroke: 'none' }} />
                  <Legend content={<CustomLegend />} />
                  <Area type="monotone" dataKey="totalCases" name="Total Cases" fill="url(#gradientTotal)" stroke={CHART_COLORS.blue} fillOpacity={1} strokeWidth={2} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Cases by Status</CardTitle>
            {!loading && statusData && statusData.length > 0 && (
              <CSVLink data={statusData} filename="cases-by-status.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }} aria-label="Export chart data as CSV">
                <Download className="w-3.5 h-3.5" />
              </CSVLink>
            )}
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="w-full h-[300px]" /> : (
              <ResponsiveContainer width="100%" height={300} debounce={0}>
                <PieChart>
                  <Pie data={statusData || []} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={70} outerRadius={100} cornerRadius={2} paddingAngle={2} isAnimationActive={false} stroke="none">
                    {(statusData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLOR_LIST[index % CHART_COLOR_LIST.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
                  <Legend content={<CustomLegend />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Category Distribution</CardTitle>
          {!loading && categoryData && categoryData.length > 0 && (
            <CSVLink data={categoryData} filename="category-distribution.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }} aria-label="Export chart data as CSV">
              <Download className="w-3.5 h-3.5" />
            </CSVLink>
          )}
        </CardHeader>
        <CardContent>
          {loading ? <Skeleton className="w-full h-[300px]" /> : (
            <ResponsiveContainer width="100%" height={300} debounce={0}>
              <BarChart data={categoryData || []} layout="vertical" margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} width={150} />
                <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={false} />
                <Bar dataKey="count" name="Cases" fill={CHART_COLORS.purple} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} radius={[0, 2, 2, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
