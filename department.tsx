import { DashboardHeader } from "@/components/dashboard-header";
import { useGetCasesByDepartment, useGetResolutionTimeByDepartment, useGetSlaCompliance, useGetTopAssignees } from "@workspace/api-client-react";
import { formatNumber, formatCurrency, formatPercent, CHART_COLORS } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CSVLink } from "@/components/ui/csv-link";
import { Download } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

export default function DepartmentPage() {
  const { data: deptData, isLoading: deptLoading, isFetching: deptFetching, dataUpdatedAt } = useGetCasesByDepartment();
  const { data: resTimeData, isLoading: resLoading, isFetching: resFetching } = useGetResolutionTimeByDepartment();
  const { data: slaData, isLoading: slaLoading, isFetching: slaFetching } = useGetSlaCompliance();
  const { data: assigneeData, isLoading: assignLoading, isFetching: assignFetching } = useGetTopAssignees();
  
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "#e5e5e5";
  const tickColor = isDark ? "#98999C" : "#71717a";

  const loading = deptLoading || deptFetching || resLoading || resFetching || slaLoading || slaFetching || assignLoading || assignFetching;

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Department Analysis" 
        subtitle="Performance breakdown by department and top assignees"
        lastRefreshedAt={dataUpdatedAt}
        loading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">SLA Compliance by Department</CardTitle>
            {!loading && slaData && slaData.length > 0 && (
              <CSVLink data={slaData} filename="sla-compliance.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}>
                <Download className="w-3.5 h-3.5" />
              </CSVLink>
            )}
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="w-full h-[300px]" /> : (
              <ResponsiveContainer width="100%" height={300} debounce={0}>
                <ComposedChart data={slaData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="department" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={false} />
                  <Legend content={<CustomLegend />} />
                  <Bar yAxisId="left" dataKey="totalCases" name="Total Cases" fill={CHART_COLORS.blue} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} radius={[2, 2, 0, 0]} isAnimationActive={false} />
                  <Line yAxisId="right" type="monotone" dataKey="complianceRate" name="Compliance Rate" stroke={CHART_COLORS.green} strokeWidth={2} dot={false} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Resolution Time (P50 vs P95)</CardTitle>
            {!loading && resTimeData && resTimeData.length > 0 && (
              <CSVLink data={resTimeData} filename="resolution-time.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}>
                <Download className="w-3.5 h-3.5" />
              </CSVLink>
            )}
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="w-full h-[300px]" /> : (
              <ResponsiveContainer width="100%" height={300} debounce={0}>
                <BarChart data={resTimeData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="department" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                  <YAxis tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={false} />
                  <Legend content={<CustomLegend />} />
                  <Bar dataKey="p50Hours" name="P50 Hours" fill={CHART_COLORS.purple} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} radius={[2, 2, 0, 0]} isAnimationActive={false} />
                  <Bar dataKey="p95Hours" name="P95 Hours" fill={CHART_COLORS.pink} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} radius={[2, 2, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="px-4 pt-4 pb-2">
          <CardTitle className="text-base">Department Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2"><Skeleton className="h-10 w-full" />{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Total Cases</TableHead>
                    <TableHead className="text-right">Open Cases</TableHead>
                    <TableHead className="text-right">Resolved</TableHead>
                    <TableHead className="text-right">Avg Resolution (hrs)</TableHead>
                    <TableHead className="text-right">Avg CSAT</TableHead>
                    <TableHead className="text-right">Total Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(deptData || []).map((row) => (
                    <TableRow key={row.department}>
                      <TableCell className="font-medium">{row.department}</TableCell>
                      <TableCell className="text-right">{formatNumber(row.totalCases)}</TableCell>
                      <TableCell className="text-right">{formatNumber(row.openCases)}</TableCell>
                      <TableCell className="text-right">{formatNumber(row.resolvedCases)}</TableCell>
                      <TableCell className="text-right">{row.avgResolutionHours.toFixed(1)}</TableCell>
                      <TableCell className="text-right">{row.avgSatisfactionScore.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.totalCost)}</TableCell>
                    </TableRow>
                  ))}
                  {(!deptData || deptData.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">No data available.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-4 pt-4 pb-2">
          <CardTitle className="text-base">Top Assignees Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2"><Skeleton className="h-10 w-full" />{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignee ID</TableHead>
                    <TableHead className="text-right">Total Cases</TableHead>
                    <TableHead className="text-right">Resolved Cases</TableHead>
                    <TableHead className="text-right">Avg CSAT</TableHead>
                    <TableHead className="text-right">Resolution Time (hrs)</TableHead>
                    <TableHead className="text-right">Escalation Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(assigneeData || []).map((row) => (
                    <TableRow key={row.assigneeId}>
                      <TableCell className="font-medium">{row.assigneeId}</TableCell>
                      <TableCell className="text-right">{formatNumber(row.totalCases)}</TableCell>
                      <TableCell className="text-right">{formatNumber(row.resolvedCases)}</TableCell>
                      <TableCell className="text-right">{row.avgSatisfactionScore.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{row.avgResolutionHours.toFixed(1)}</TableCell>
                      <TableCell className="text-right">{formatPercent(row.escalationRate)}</TableCell>
                    </TableRow>
                  ))}
                  {(!assigneeData || assigneeData.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">No data available.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
