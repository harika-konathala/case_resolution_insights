import { useState, useRef, useEffect } from "react";
import { Printer, Sun, Moon, RefreshCw, ChevronDown, Check } from "lucide-react";
import { useTheme } from "./theme-provider";
import { DATA_SOURCES } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  lastRefreshedAt?: number;
  loading?: boolean;
  onRefresh?: () => void;
}

const INTERVAL_OPTIONS = [
  { label: "Off", ms: 0 },
  { label: "Every 5 min", ms: 5 * 60 * 1000 },
  { label: "Every 15 min", ms: 15 * 60 * 1000 },
  { label: "Every 1 hour", ms: 60 * 60 * 1000 },
];

export function DashboardHeader({ title, subtitle, lastRefreshedAt, loading, onRefresh }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIntervalMs, setSelectedIntervalMs] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (loading) {
      setIsSpinning(true);
    } else {
      const t = setTimeout(() => setIsSpinning(false), 600);
      return () => clearTimeout(t);
    }
  }, [loading]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedIntervalMs > 0) {
      const interval = setInterval(() => {
        queryClient.invalidateQueries();
      }, selectedIntervalMs);
      return () => clearInterval(interval);
    }
  }, [selectedIntervalMs, queryClient]);

  const handleRefreshClick = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      queryClient.invalidateQueries();
    }
  };

  const lastRefreshed = lastRefreshedAt
    ? (() => {
        const d = new Date(lastRefreshedAt);
        const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();
        const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        return `${time} on ${date}`;
      })()
    : null;

  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
      <div className="pt-2">
        <h1 className="font-bold text-[32px]">{title}</h1>
        <p className="text-muted-foreground mt-1.5 text-[14px]">{subtitle}</p>
        
        {DATA_SOURCES.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-[12px] text-muted-foreground shrink-0">Data Sources:</span>
            {DATA_SOURCES.map((source) => (
              <span
                key={source}
                className="text-[12px] font-bold rounded px-2 py-0.5 truncate print:!bg-[rgb(229,231,235)] print:!text-[rgb(75,85,99)]"
                title={source}
                style={{
                  maxWidth: "20ch",
                  backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgb(229, 231, 235)",
                  color: isDark ? "#c8c9cc" : "rgb(75, 85, 99)",
                }}
              >
                {source}
              </span>
            ))}
          </div>
        )}

        {lastRefreshed && (
          <p className="text-[12px] text-muted-foreground mt-3">Last refresh: {lastRefreshed}</p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2 print:hidden">
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center rounded-[6px] overflow-hidden h-[26px] text-[12px]"
            style={{
              backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2",
              color: isDark ? "#c8c9cc" : "#4b5563",
            }}
          >
            <button
              onClick={handleRefreshClick}
              disabled={loading}
              className="flex items-center gap-1 px-2 h-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSpinning ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <div className="w-px h-4 shrink-0" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }} />
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center justify-center px-1.5 h-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 top-[30px] w-40 bg-popover border border-border rounded-md shadow-md z-50 overflow-hidden text-sm">
              <div className="p-2 border-b border-border bg-muted/50 font-medium text-xs text-muted-foreground">
                Auto-Refresh
              </div>
              <div className="p-1">
                {INTERVAL_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-muted rounded-sm text-left"
                    onClick={() => {
                      setSelectedIntervalMs(opt.ms);
                      setDropdownOpen(false);
                    }}
                  >
                    <span>{opt.label}</span>
                    {selectedIntervalMs === opt.ms && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => window.print()}
          disabled={loading}
          className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors disabled:opacity-50"
          style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}
          aria-label="Export as PDF"
        >
          <Printer className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors"
          style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}
