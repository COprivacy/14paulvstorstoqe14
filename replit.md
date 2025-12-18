# Controle de Estoque Simples

## Overview
**PAVISOFT SISTEMAS** - Complete business management system for Brazilian small businesses (SMEs).

**Status:** 🟢 **PRODUCTION READY - READY FOR LAUNCH**

A web application offering inventory management, point-of-sale (PDV) with barcode scanning, sales tracking, comprehensive financial module, NF-e/NFC-e invoice emission, employee control with audit logs, and multi-tenant architecture. System emphasizes simplicity, security, Brazilian compliance, and competitive pricing (R$ 89-299/month).

**Key Differentiators:**
- ✅ NF-e integrada (sem custo extra, vs Omni que cobra R$ 50+)
- ✅ Módulo financeiro completo (A/P, A/R, Cash Flow)
- ✅ Devoluções/Trocas gerenciadas
- ✅ Controle de funcionários com auditoria
- ✅ 30% mais barato que Omni/Tiny
- ✅ Multi-tenant com isolamento de dados
- ✅ Session management com fingerprint
- ✅ Progressive Web App (PWA) - mobile ready

## User Preferences
Preferred communication style: Simple, everyday language.

## Business Strategy
- **Target Market:** Small retailers (1-50 employees), coffee shops, small restaurants, boutiques
- **Pricing:** R$ 89 (Básico), R$ 179 (Profissional), R$ 299 (Empresarial)
- **GTM:** Direct sales to owner/managers, startup pitch
- **Competitive Advantage:** Integrated NF-e + Financial Management + Lower Price
- **Revenue Model:** SaaS subscription (monthly/annual)
- **Next Phase:** App Mobile (Q2 2025), Marketplace Integration (Q2 2025), Payment Gateway (Q3 2025)

## Recent Changes
**2025-12-13:** Fixed Mercado Pago Webhook Duplicate Payment Bug:
- Identified bug where Mercado Pago webhook was processing same payment multiple times, creating duplicate employee packages
- Added `getEmployeePackageByPaymentId` method to check for existing payments before processing
- Added UNIQUE index on `employee_packages.payment_id` column for database-level protection
- Updated `createEmployeePackage` to use `ON CONFLICT DO NOTHING` for atomic duplicate prevention
- Added duplicate payment check for subscription webhooks (checks `mercadopago_payment_id`)
- Fixed customer data: removed duplicate entry and corrected `max_funcionarios` count

**2025-12-12:** Implemented Device Fingerprinting and Session Management:
- Created `user_sessions` table to track active sessions with fingerprint, token, device info
- Implemented client-side fingerprinting using Web Crypto API (browser, OS, screen, canvas hash)
- Session token stored in localStorage and sent via `x-session-token` header with all API requests
- Added `validateSession` middleware for session validation on all /api routes (except auth)
- Session limit: Maximum 3 simultaneous sessions per user (oldest automatically invalidated)
- 24-hour inactivity timeout with automatic session expiration
- Endpoints: `/api/sessions/logout`, `/api/sessions/my-sessions`, `/api/sessions/invalidate`
- Gradual rollout approach: Old sessions without tokens still work during transition period

**2025-12-10:** Added System Maintenance Tab to Admin Panel:
- New "Manutenção" tab in /admin-publico for database health monitoring
- Added 4 maintenance API endpoints: analyze, fix-expired-users, cleanup-subscriptions, run-full
- MaintenanceTab component shows statistics and allows running maintenance actions
- Features: Analyze inconsistencies, block expired users, clean orphan subscriptions, run full maintenance
- Displays detailed analysis results with color-coded severity levels

**2025-11-30:** Fixed Dashboard and Devoluções integration:
- Dashboard "Vendas Hoje" now correctly subtracts approved devoluções (returns)
- All sales metrics (daily, weekly trends, monthly comparisons) now account for returns
- Added Math.max(0, ...) protection to prevent negative sales values
- Fixed Devolucoes.tsx to include venda_id when creating devoluções from sales (enables proper linking in reports)
- Note: Historical devoluções created before this fix lack venda_id and need a migration script to retroactively link

**2025-12-02:** Removed all Asaas payment gateway dependencies - system now uses only Mercado Pago for payments.

**2025-11-26:** Fixed dynamic pricing system for payment webhooks and coupon validation:
- Replaced hardcoded prices in Mercado Pago webhook with dynamic fetch from `storage.getSystemConfig('pacotes_funcionarios_precos')`
- Updated coupon validation to fetch plan prices dynamically from `storage.getSystemConfig('planos_precos')`
- All payment flows now use actual payment amounts when available, with database-configured fallbacks

**2025-11-10 (Evening):** Implemented comprehensive audit log system for employee monitoring:
- Added `getLogsAdminByAccount` method in PostgresStorage with secure parameterized queries (using `inArray`)
- Created GET `/api/logs-admin` route with data enrichment (user name/email)
- Built "Logs de Auditoria" tab in Admin page with sortable table
- Implemented automatic logging for employee login and permission updates
- Fixed SQL injection vulnerability by replacing raw SQL with Drizzle's `inArray`
- System currently logs: LOGIN_FUNCIONARIO, PERMISSOES_ATUALIZADAS (expandable to more actions)

**2025-11-10 (Earlier):** Fixed Orçamentos (Budget/Quotes) page - rebuilt with professional UI, proper data validation, and full functionality (create, view, print, approve, reject, convert to sale, delete). Resolved TypeScript naming conflicts (camelCase vs snake_case).

## System Architecture

### Frontend
- **Technology Stack:** React 18, TypeScript, Vite, Wouter, TanStack Query, Tailwind CSS, shadcn/ui.
- **Design System:** shadcn/ui "new-york" preset, custom Brazilian Portuguese color palette, responsive mobile-first design.
- **Key Features:** Product management (barcode, expiration), PDV, sales tracking, dashboard alerts, reports (sales, expiration), supplier/purchase management, client management, returns/devolutions management, full Financial Management Module (Accounts Payable/Receivable, Projected POS Cash Flow, Simplified Income Statement), Brazilian Invoice (NF-e/NFC-e) emission, optional non-fiscal receipt, and PWA support.
- **Admin Panels:** `/admin-publico` (Super admin for system owner), `/admin` (Account admin for customers).
- **Access Control:** Permission-based system for employees with frontend protection.

### Backend
- **Technology Stack:** Node.js, Express.js, TypeScript.
- **Database:** Neon-hosted PostgreSQL with Drizzle ORM.
- **API Design:** RESTful with JSON responses, authentication, CRUD for products, sales, and reports.
- **Data Models:** Users, Products, Sales, Suppliers, Purchases, Clients, Devoluções (Returns), Fiscal Config, Caixas (Cash Registers), Movimentações de Caixa.
- **Architectural Decisions:** Monorepo structure, type safety via shared TypeScript schemas, progressive enhancement, bilingual support (Brazilian Portuguese), mobile-first design, fiscal responsibility (user-provided NFe credentials), and invoice data validation with Zod.
- **Multi-Tenant Security:** Complete data isolation across all API routes using `effective-user-id` for ownership and filtering.
- **Cash Register System (Caixa):** Complete cash register management with opening/closing, automatic tracking of sales/movements, and historical records. Sales require an open cash register.

## External Dependencies
- **UI Components:** Radix UI primitives, shadcn/ui, Lucide React.
- **Database:** Neon Serverless PostgreSQL (`@neondatabase/serverless`), Drizzle ORM (`drizzle-orm`, `drizzle-zod`), `connect-pg-simple`.
- **Form Management:** React Hook Form, Zod (`@hookform/resolvers`).
- **Utilities:** `date-fns`, `clsx`, `tailwind-merge`, `class-variance-authority`.
- **Development Tools:** Vite plugins for Replit, TypeScript, ESBuild.
- **Authentication:** Basic email/password.
- **Invoice Integration:** Focus NFe API.
- **Payment Gateway:** Mercado Pago (for subscription management and employee package purchases).