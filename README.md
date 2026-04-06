Case Resolution Analytics Dashboard
Overview
A professional enterprise-grade Business Intelligence dashboard built on a pnpm monorepo. Analyzes 50,000 support cases from a case resolution dataset with rich insights across departments, priorities, customer tiers, countries, and financial metrics.
Stack
Monorepo tool: pnpm workspaces
Node.js version: 24
Package manager: pnpm
TypeScript version: 5.9
Frontend: React + Vite (case-resolution-dashboard)
API framework: Express 5 (api-server)
Database: PostgreSQL + direct pg pool queries
Charts: Recharts
Tables: @tanstack/react-table
API codegen: Orval (from OpenAPI spec)
Build: esbuild (CJS bundle)
Dashboard Sections
Overview — 10 KPI cards, case volume time series, status distribution donut chart, category breakdown
Department Analysis — per-department metrics table, resolution time percentiles (p50/p95), SLA compliance, top assignees
Priority & Escalation — priority distribution chart, escalation rates by department
Customer Insights — tier-based satisfaction scores, country-level breakdown, satisfaction score distribution (1-5 stacked bars)
Financial Analytics — cost breakdown by department (bar + table)
Case Explorer — filterable, paginated data table (50k rows) with department/status/priority dropdowns
Dataset
Source: `attached_assets/final_case_resolution_project_dataset_50k_1775464922238.xlsx`
Size: 50,000 cases
Fields: case_id, client_id, assignee_id, department, priority, status, case_category, customer_tier, country, currency, case_cost, timestamps, resolution_time_hours, customer_satisfaction_score, escalation_flag
Departments: Operations, Support, Technical, Compliance, Billing
Countries: India, Canada, Singapore, Germany, UK, USA
Customer Tiers: Platinum, Gold, Silver, Standard
Key Commands
`pnpm run typecheck` — full typecheck across all packages
`pnpm run build` — typecheck + build all packages
`pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks from OpenAPI spec
`pnpm --filter @workspace/api-server run dev` — run API server locally
API Endpoints
All under `/api/analytics/`:
`GET /overview` — 10 KPI metrics for the full dataset
`GET /cases-by-status` — case count + % by status
`GET /cases-by-department` — full metrics per department
`GET /cases-by-priority` — priority distribution with escalation rates
`GET /cases-by-category` — category breakdown with avg cost
`GET /cases-by-country` — country metrics
`GET /cases-by-tier` — customer tier metrics
`GET /resolution-time-by-department` — avg/min/max/p50/p95 resolution hours
`GET /escalation-by-department` — escalation rates
`GET /satisfaction-by-tier` — CSAT score distribution
`GET /cost-by-department` — total/avg/min/max cost
`GET /sla-compliance` — SLA compliance rate per department
`GET /top-assignees` — top 20 assignees by volume
`GET /cases-over-time` — monthly time series (Jan 2024 – Dec 2025)
`GET /recent-cases` — paginated case records with filters
Architecture
```
artifacts/
  api-server/          # Express 5 API server
    src/routes/
      analytics.ts     # All 15 analytics endpoints
  case-resolution-dashboard/  # React + Vite frontend
    src/
      pages/           # Overview, Department, Priority, Customer, Financial, Explorer
      components/      # Layout, DashboardHeader, KPICard
      lib/constants.ts # Colors, formatters
lib/
  api-spec/openapi.yaml  # OpenAPI 3.1 spec
  api-client-react/      # Generated React Query hooks
  api-zod/               # Generated Zod validators
  db/                    # Drizzle ORM setup
```
Data Notes
The `created_timestamp` / `closed_timestamp` / `sla_deadline` fields are stored as Excel serial numbers (days since 1899-12-30). They are converted to `YYYY-MM` period strings in SQL for the time series chart.
`escalation_flag` is 0 or 1 (integer).
`customer_satisfaction_score` is 1–5 (integer).
