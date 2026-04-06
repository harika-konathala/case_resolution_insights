**Case Resolution Analytics Dashboard**
__________________________________________________________________________________________________________________________________________________________________________________________________________________
A professional enterprise-grade Business Intelligence dashboard built on a modern pnpm monorepo. Analyze 50,000 support cases to uncover rich insights across departments, priorities, customer tiers, countries, and financial metrics.

**🌐 Project Overview**
___________________________________________________________________________________________________________________________________________________________________________________________________________________

This dashboard helps organizations monitor, analyze, and optimize case resolution processes with real-time metrics and visualizations. Key features include:

**Overview:** KPIs, time series trends, case status distributions, and category breakdowns

**Department Analysis:** esolution time percentiles, SLA compliance, top assignees

**Priority & Escalation:** Priority distribution and escalation rates

**Customer Insights:** Tier-based satisfaction scores and country-level analysis

**Financial Analytics:** Cost breakdown per department

**Case Explorer:** Filterable, paginated table for detailed case inspection

**🛠 Tech Stack**
______________________________________________________________________________________________________________________________________________________________________________________________________________
Layer	Technology
Monorepo Tool	pnpm workspaces
Node.js	24
Package Manager	pnpm
TypeScript	5.9
Frontend	React + Vite (case-resolution-dashboard)
API Framework	Express 5 (api-server)
Database	PostgreSQL + direct pg pool queries
Charts	Recharts
Tables	@tanstack/react-table
API Codegen	Orval (OpenAPI)
Build	esbuild (CJS bundle)


** Dashboard Sections**
_____________________________________________________________________________________________________________________________________________________________________________________________________________
Overview

10 KPI cards

Case volume time series

Status distribution (donut chart)

Case category breakdown

Department Analysis

Metrics table per department

Resolution time percentiles (p50/p95)

SLA compliance

Top assignees

Priority & Escalation

Priority distribution chart

Escalation rates by department

Customer Insights

Customer tier satisfaction scores

Country-level breakdown

Satisfaction score distribution (1–5 stacked bars)

Financial Analytics

Cost breakdown per department (bar + table)

Case Explorer

Filterable, paginated table (50k rows)

Dropdown filters: department, status, priority


**📂 Dataset**
_____________________________________________________________________________________________________________________________________________________________________________________________________________
Source: attached_assets/final_case_resolution_project_dataset_50k_1775464922238.xlsx

Size: 50,000 cases

Fields: case_id, client_id, assignee_id, department, priority, status, case_category, customer_tier, country, currency, case_cost, timestamps, resolution_time_hours, customer_satisfaction_score, escalation_flag

Departments: Operations, Support, Technical, Compliance, Billing

Countries: India, Canada, Singapore, Germany, UK, USA

Customer Tiers: Platinum, Gold, Silver, Standard


# Full typecheck across all packages
pnpm run typecheck

# Typecheck + build all packages
pnpm run build

# Regenerate React Query hooks from OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# Run API server locally
pnpm --filter @workspace/api-server run dev



🔗 API Endpoints
All endpoints are under /api/analytics/:

Endpoint	Description
GET /overview	10 KPI metrics for the full dataset
GET /cases-by-status	Case count + % by status
GET /cases-by-department	Full metrics per department
GET /cases-by-priority	Priority distribution + escalation rates
GET /cases-by-category	Category breakdown with avg cost
GET /cases-by-country	Country-level metrics
GET /cases-by-tier	Customer tier metrics
GET /resolution-time-by-department	Avg/min/max/p50/p95 resolution hours
GET /escalation-by-department	Escalation rates
GET /satisfaction-by-tier	CSAT score distribution
GET /cost-by-department	Total/avg/min/max cost
GET /sla-compliance	SLA compliance per department
GET /top-assignees	Top 20 assignees by volume
GET /cases-over-time	Monthly time series (Jan 2024 – Dec 2025)
GET /recent-cases	Paginated case records with filters


artifacts/
 ├─ api-server/                 # Express 5 API server
 │   └─ src/routes/
 │       └─ analytics.ts        # All 15 analytics endpoints
 ├─ case-resolution-dashboard/  # React + Vite frontend
 │   └─ src/
 │       ├─ pages/              # Overview, Department, Priority, Customer, Financial, Explorer
 │       ├─ components/         # Layout, DashboardHeader, KPICard
 │       └─ lib/constants.ts    # Colors, formatters
 └─ lib/
     ├─ api-spec/openapi.yaml   # OpenAPI 3.1 spec
     ├─ api-client-react/       # Generated React Query hooks
     ├─ api-zod/                # Generated Zod validators
     └─ db/                     # Drizzle ORM setup


     📌 Data Notes
Timestamps (created_timestamp, closed_timestamp, sla_deadline) are stored as Excel serial numbers (days since 1899-12-30). Converted to YYYY-MM for time series charts.

escalation_flag: 0 or 1 (integer)

customer_satisfaction_score: 1–5 (integer)


🚀 Highlights
Enterprise-grade dashboard with 50k+ case data

Fully filterable and paginated tables

SLA compliance tracking, priority escalation analysis

Customer insights by tier & country

Cost and financial analytics per department
