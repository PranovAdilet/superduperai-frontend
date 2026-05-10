# SuperDuperAI Frontend

Frontend application for **SuperDuperAI** — an AI-powered video generation and
editing platform with timeline-based editor, multi-agent AI workflow, and
cinematic rendering system.

> ⚠️ This repository contains only the frontend part of the system.  
> Backend services (AI generation, rendering pipeline, auth, etc.) are not
> included.

---

## Key Features

- Timeline-based video editor (FSD architecture)
- Canvas editing with Fabric.js
- AI-driven video generation UI (multi-agent workflow UI layer)
- Remotion-based rendering pipeline integration
- Modular component system (Feature-Sliced Design)
- Real-time updates via API / SSE (backend required)
- Export-ready video workflows (YouTube / TikTok formats)

---

## Tech Stack

- **Next.js 14**
- **React 18**
- **TypeScript**
- **React Query**
- **Fabric.js**
- **Remotion**
- **Zustand**
- **TailwindCSS**
- **Sentry**

---

## Getting Started

### Prerequisites

- Node.js 20+
- Yarn 1.22+

## Install dependencies

```bash
yarn install
```

## Run development server

```bash
yarn dev
```

## Notes

Backend API is required for full functionality AI generation and rendering
features will not work without backend services This repository represents the
frontend architecture and UI layer of a production SaaS system

## Architecture

### This project uses Feature-Sliced Design (FSD):

- **app/ — app initialization**
- **pages/ — routing pages**
- **widgets/ — large UI blocks**
- **features/ — business logic**
- **entities/ — domain models**
- **shared/ — utilities, API, UI kit**

## About the Project

#### SuperDuperAI is a multi-agent AI video generation platform where users can:

- Describe an idea
- AI generates script, scenes, and characters
- Users refine and export cinematic videos

#### This repository represents the frontend system powering the editor and workflow UI.
