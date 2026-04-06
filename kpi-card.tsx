import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  loading?: boolean;
  valueColor?: string;
}

export function KPICard({ title, value, change, trend, loading, valueColor = "#0079F2" }: KPICardProps) {
  const isPositive = trend === "up";
  const isNegative = trend === "down";

  return (
    <Card>
      <CardContent className="p-6 flex flex-col justify-center min-h-[120px]">
        {loading ? (
          <>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32" />
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: valueColor }}>{value}</p>
            {change && (
              <div className="flex items-center gap-1 mt-1">
                {isPositive && <ArrowUpIcon className="w-4 h-4 text-green-600" />}
                {isNegative && <ArrowDownIcon className="w-4 h-4 text-red-600" />}
                <span className={`text-sm ${isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-muted-foreground"}`}>{change}</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
