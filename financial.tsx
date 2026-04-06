import { DashboardHeader } from "@/components/dashboard-header";
import { useGetCostByDepartment } from "@workspace/api-client-react";
import { formatNumber, formatCurrency, CHART_COLORS } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CSVLink } from "@/components/ui/csv-link";
import { Download } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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
          <span style={{ marginLeft: "auto", fontWeight: 600 }}>{typeof entry.value === "number" ? formatCurrency(entry.value) : entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function FinancialPage() {
  const { data: costData, isLoading: costLoading, isFetching: costFetching, dataUpdatedAt } = useGetCostByDepartment();
  
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "#e5e5e5";
  const tickColor = isDark ? "#98999C" : "#71717a";

  const loading = costLoading || costFetching;

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Financial Analytics" 
        subtitle="Cost analysis across departments"
        lastRefreshedAt={dataUpdatedAt}
        loading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Total Cost by Department</CardTitle>
            {!loading && costData && costData.length > 0 && (
              <CSVLink data={costData} filename="total-cost.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}>
                <Download className="w-3.5 h-3.5" />
              </CSVLink>
            )}
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="w-full h-[300px]" /> : (
              <ResponsiveContainer width="100%" height={300} debounce={0}>
                <BarChart data={costData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="department" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                  <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={false} />
                  <Bar dataKey="totalCost" name="Total Cost" fill={CHART_COLORS.blue} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} radius={[2, 2, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Average Cost per Case</CardTitle>
            {!loading && costData && costData.length > 0 && (
              <CSVLink data={costData} filename="avg-cost.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}>
                <Download className="w-3.5 h-3.5" />
              </CSVLink>
            )}
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="w-full h-[300px]" /> : (
              <ResponsiveContainer width="100%" height={300} debounce={0}>
                <BarChart data={costData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="department" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                  <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={false} />
                  <Bar dataKey="avgCost" name="Avg Cost" fill={CHART_COLORS.purple} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} radius={[2, 2, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="px-4 pt-4 pb-2">
          <CardTitle className="text-base">Cost Breakdown Details</CardTitle>
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
                    <TableHead className="text-right">Case Count</TableHead>
                    <TableHead className="text-right">Total Cost</TableHead>
                    <TableHead className="text-right">Avg Cost</TableHead>
                    <TableHead className="text-right">Min Cost</TableHead>
                    <TableHead className="text-right">Max Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(costData || []).map((row) => (
                    <TableRow key={row.department}>
                      <TableCell className="font-medium">{row.department}</TableCell>
                      <TableCell className="text-right">{formatNumber(row.caseCount)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.totalCost)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.avgCost)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.minCost)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.maxCost)}</TableCell>
                    </TableRow>
                  ))}
                  {(!costData || costData.length === 0) && (
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
