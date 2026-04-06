import { useState, useMemo } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { useGetRecentCases } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { formatCurrency } from "@/lib/constants";

// The schema should be accessible from the generated API if needed, or we can just type it directly since we know the shape.
// But we'll just import it from the client if it's exported, otherwise we use any or the inferred type.
// We'll use any or a locally defined interface to be safe.
interface CaseRecord {
  caseId: string;
  clientId: string;
  assigneeId: string;
  department: string;
  priority: string;
  status: string;
  caseCategory: string;
  customerTier: string;
  country: string;
  currency: string;
  caseCost: number;
  resolutionTimeHours: number | null;
  customerSatisfactionScore: number | null;
  escalationFlag: number;
  caseDescription: string | null;
}

export default function ExplorerPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  
  const [queryOptions, setQueryOptions] = useState<{ department?: string; status?: string; priority?: string }>({});

  const { data, isLoading, isFetching, dataUpdatedAt } = useGetRecentCases({
    ...queryOptions,
    limit: 50,
  });

  const cases = (data?.cases || []) as CaseRecord[];
  const loading = isLoading || isFetching;

  const handleSearch = () => {
    setQueryOptions({
      department: department || undefined,
      status: status || undefined,
      priority: priority || undefined,
    });
  };

  const columns = useMemo<ColumnDef<CaseRecord>[]>(() => [
    { accessorKey: "caseId", header: "Case ID", cell: ({ row }) => <span className="font-mono text-sm">{row.original.caseId}</span> },
    { accessorKey: "department", header: "Department" },
    { accessorKey: "priority", header: "Priority", cell: ({ row }) => {
      const p = row.original.priority;
      const colorMap: Record<string, string> = { Critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", High: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400", Medium: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", Low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" };
      return <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${colorMap[p] || "bg-gray-100 text-gray-800"}`}>{p}</span>;
    }},
    { accessorKey: "status", header: "Status", cell: ({ row }) => {
      const s = row.original.status;
      return <span className="text-sm">{s}</span>;
    }},
    { accessorKey: "caseCategory", header: "Category" },
    { accessorKey: "customerTier", header: "Tier" },
    { accessorKey: "caseCost", header: "Cost", cell: ({ row }) => <span className="text-sm">{formatCurrency(row.original.caseCost)}</span> },
    { accessorKey: "resolutionTimeHours", header: "Res Time (h)", cell: ({ row }) => <span className="text-sm">{row.original.resolutionTimeHours ?? "--"}</span> },
  ], []);

  const table = useReactTable({
    data: cases,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Case Explorer" 
        subtitle="Search and filter through recent cases"
        lastRefreshedAt={dataUpdatedAt}
        loading={loading}
      />

      <Card>
        <CardHeader className="px-4 pt-4 pb-2">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-[200px]">
              <Label className="text-[13px] mb-1 block">Department</Label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">All Departments</option>
                <option value="Operations">Operations</option>
                <option value="Support">Support</option>
                <option value="Technical">Technical</option>
                <option value="Compliance">Compliance</option>
                <option value="Billing">Billing</option>
              </select>
            </div>
            <div className="w-[200px]">
              <Label className="text-[13px] mb-1 block">Status</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
                <option value="Escalated">Escalated</option>
                <option value="Review Pending">Review Pending</option>
              </select>
            </div>
            <div className="w-[200px]">
              <Label className="text-[13px] mb-1 block">Priority</Label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <Button onClick={handleSearch}>Fetch Data</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Input
              placeholder="Search all columns..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />

            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead key={header.id} onClick={header.column.getToggleSortingHandler()} className="cursor-pointer select-none">
                              <div className="flex items-center gap-2">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {{ asc: " 🔼", desc: " 🔽" }[header.column.getIsSorted() as string] ?? null}
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="h-24 text-center">
                            No results found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                    {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}{" "}
                    of {table.getFilteredRowModel().rows.length} results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
