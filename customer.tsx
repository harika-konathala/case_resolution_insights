import { DashboardHeader } from "@/components/dashboard-header";
import { useGetCasesByTier, useGetCasesByCountry, useGetSatisfactionByTier } from "@workspace/api-client-react";
import { formatNumber, formatPercent, CHART_COLORS, CHART_COLOR_LIST } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CSVLink } from "@/components/ui/csv-link";
import { Download } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
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

export default function CustomerPage() {
  const { data: tierData, isLoading: tierLoading, isFetching: tierFetching, dataUpdatedAt } = useGetCasesByTier();
  const { data: countryData, isLoading: countryLoading, isFetching: countryFetching } = useGetCasesByCountry();
  const { data: satData, isLoading: satLoading, isFetching: satFetching } = useGetSatisfactionByTier();
  
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "#e5e5e5";
  const tickColor = isDark ? "#98999C" : "#71717a";

  const loading = tierLoading || tierFetching || countryLoading || countryFetching || satLoading || satFetching;

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Customer Insights" 
        subtitle="Satisfaction scores and case distribution by country and tier"
        lastRefreshedAt={dataUpdatedAt}
        loading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Satisfaction Distribution by Tier</CardTitle>
            {!loading && satData && satData.length > 0 && (
              <CSVLink data={satData} filename="satisfaction-by-tier.csv" className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}>
                <Download className="w-3.5 h-3.5" />
              </CSVLink>
            )}
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="w-full h-[300px]" /> : (
              <ResponsiveContainer width="100%" height={300} debounce={0}>
                <BarChart data={satData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="tier" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                  <YAxis tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={false} />
                  <Legend content={<CustomLegend />} />
                  <Bar dataKey="score1" stackId="a" name="Score 1" fill={CHART_COLORS.red} fillOpacity={1} isAnimationActive={false} />
                  <Bar dataKey="score2" stackId="a" name="Score 2" fill={CHART_COLORS.pink} fillOpacity={1} isAnimationActive={false} />
                  <Bar dataKey="score3" stackId="a" name="Score 3" fill={CHART_COLORS.purple} fillOpacity={1} isAnimationActive={false} />
                  <Bar dataKey="score4" stackId="a" name="Score 4" fill={CHART_COLORS.blue} fillOpacity={1} isAnimationActive={false} />
                  <Bar dataKey="score5" stackId="a" name="Score 5" fill={CHART_COLORS.green} fillOpacity={1} radius={[2, 2, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-4 pt-4 pb-2">
            <CardTitle className="text-base">Tier Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2"><Skeleton className="h-10 w-full" />{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tier</TableHead>
                      <TableHead className="text-right">Cases</TableHead>
                      <TableHead className="text-right">Avg CSAT</TableHead>
                      <TableHead className="text-right">Res Time (hrs)</TableHead>
                      <TableHead className="text-right">Escalation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(tierData || []).map((row) => (
                      <TableRow key={row.tier}>
                        <TableCell className="font-medium">{row.tier}</TableCell>
                        <TableCell className="text-right">{formatNumber(row.totalCases)}</TableCell>
                        <TableCell className="text-right">{row.avgSatisfactionScore.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{row.avgResolutionHours.toFixed(1)}</TableCell>
                        <TableCell className="text-right">{formatPercent(row.escalationRate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="px-4 pt-4 pb-2">
          <CardTitle className="text-base">Country Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2"><Skeleton className="h-10 w-full" />{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead className="text-right">Total Cases</TableHead>
                    <TableHead className="text-right">Avg CSAT</TableHead>
                    <TableHead className="text-right">Escalation Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(countryData || []).map((row) => (
                    <TableRow key={row.country}>
                      <TableCell className="font-medium">{row.country}</TableCell>
                      <TableCell className="text-right">{formatNumber(row.totalCases)}</TableCell>
                      <TableCell className="text-right">{row.avgSatisfactionScore.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{formatPercent(row.escalationRate)}</TableCell>
                    </TableRow>
                  ))}
                  {(!countryData || countryData.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">No data available.</TableCell>
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
