# ITFIX - Professional IT Support Extranet

## Problem Statement

Modern businesses and IT departments struggle to maintain efficient technical operations due to fragmented communication and outdated infrastructure management. The traditional process of IT support involves:

- **Manual Ticket Tracking:** Relying on scattered emails or spreadsheets to track hardware and software issues.
- **Lack of Transparency:** Clients and employees have no real-time visibility into the status of their repair or support requests.
- **Infrastructure Inefficiency:** High upfront costs (CAPEX) for on-premise servers and difficulty scaling IT resources.
- **Poor Asset Management:** Difficulty tracking technical hardware, maintenance schedules, and software licenses.
- **Data Silos:** No centralized digital repository for technical documentation and incident history.

## Solution

ITFIX is a comprehensive IT Support Extranet and Ticketing platform built to streamline technical operations and bridge the gap between clients and IT technicians. The platform provides:

- **For Clients:** A streamlined interface to report technical issues, track ticket progress, and manage their service history.
- **For Technicians:** A powerful administrative dashboard to prioritize tasks, manage assets, and resolve technical incidents efficiently.
- **Cloud-First Architecture:** Leveraging a serverless approach to shift from high CAPEX (Capital Expenditure) to a predictable OPEX (Operating Expenditure) model.
- **Secure Infrastructure:** Built on Supabase for enterprise-grade security, real-time data syncing, and robust authentication.

## Technology Stack

### Frontend

- **Framework:** React 18 (via Vite)
- **Language:** TypeScript (for type-safe development)
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS (Modern, utility-first CSS)
- **Icons:** Lucide React
- **UI Components:** Custom modular components for high performance.

### Backend & Services

- **Backend as a Service:** Supabase
- **Database:** PostgreSQL (Relational data for tickets, users, and assets)
- **Authentication:** Supabase Auth (Email/Password & Session Management)
- **Storage:** Supabase Storage for technical logs and attachments.

### Development Tools

- **Build Tool:** Vite (Ultra-fast development environment)
- **Package Manager:** npm
- **Type Checking:** TypeScript ESLint

## Features

### For Clients (End-Users)

#### Authentication & Profile Management

- Secure login and registration via Supabase.
- Personalized dashboard showing active support requests.

#### Ticketing System

- Open new support tickets for hardware or software issues.
- Attach descriptions and priority levels.
- Real-time status tracking (Pending, In Progress, Resolved).

#### Asset Overview

- View assigned hardware and technical assets.
- Access maintenance history for personal equipment.

#### Notifications

- Updates when a technician is assigned to a ticket.
- Alerts when a support request is closed.

### For Technicians & Administrators

#### Centralized Management Dashboard

- High-level overview of open tickets and system health.
- Metrics on resolution times and team performance.

#### Ticket Orchestration

- Claim, assign, or escalate technical tickets.
- Update ticket status and add internal technical notes.
- Filter tickets by priority, department, or date.

#### Inventory & Asset Management

- Track the lifecycle of IT equipment (Laptops, Servers, Networking).
- Manage software licenses and renewal dates.

#### User Administration

- Manage user roles and permissions.
- Approve or suspend accounts within the extranet.

#### Technical Documentation

- Centralized knowledge base for common troubleshooting steps.
- Internal documentation for system configurations.

## DATABASE SCHEMA

| Élément | Dans le sujet | Dans IT-Fix | Description |
|---------|--------------|-------------|-------------|
| Table A | Utilisateurs | Employés | Se connectent pour soumettre des tickets |
| Table B | Ressources | Techniciens | Spécialistes IT (Hardware, Software, Network) |
| Table C | Interactions | Tickets | Relie un employé à un technicien avec statut et date |
| Fichier | Document uploadé | Screenshot du bug | Image uploadée via Supabase Storage |

## Setup & Installation

### Clone the repository
```bash
git clone https://github.com/libenyakoub-coder/ITFIX.git
cd ITFIX
```

### Install dependencies
```bash
npm install
```

### Configure environment variables (.env)
Create a `.env` file in the root directory and add your credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
VITE_OUTMAIL_KEY={"key": "your_outmail_api_key"}
VITE_OUTMAIL_TOKEN_ACCESS=your_outmail_google_token_access
VITE_OUTMAIL_TOKEN_REFRESH=your_outmail_google_token_refresh
```

### Database Setup
Run the database migrations in your Supabase SQL editor to set up the tables (`tickets`, `assets`, `users`).

### Start development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Available Scripts
- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check for code quality issues

## Cloud Strategy (CAPEX vs OPEX)

Unlike traditional IT solutions that require heavy investment in physical servers (CAPEX), ITFIX is designed for the modern cloud era:

- **Zero Hardware Overhead:** No need to maintain physical database servers.
- **Scalability:** Resources scale automatically based on user demand.
- **Reduced Costs:** Operational costs are based on usage, allowing for better budget forecasting.
