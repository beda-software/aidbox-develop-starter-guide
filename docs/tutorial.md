---
sidebar_position: 1
---

# aidbox-develop-starter-guide

## Intro

Welcome to the tutorial! In this tutorial, we will be creating a MVP application for doctors in laboratories to use for determining \*hemoglobin levels.

<sub><sup>\*Hemoglobin is a protein found in the blood that is responsible for transporting oxygen throughout the body. It is measured in units per deciliter of blood (g/dL).</sup></sub>

## Features

- Getting the [Patient](https://build.fhir.org/patient.html) resource list
- Create a Patient resource
- Getting a list of [Observation](https://build.fhir.org/observation.html) resources for the specified patient
- Creating an Observation resource

## Setup

Create a directory with any name, in the tutorial it will be called `main-directory`.

In the `main-directory`, create and launch an [Aidbox application](https://www.health-samurai.io/aidbox) by following the [guide on the official Aidbox documentation site](https://docs.aidbox.app/getting-started/run-aidbox-locally-with-docker).

Next, in the `main-directory` create a React application with the command:

```bash
yarn create react-app frontend --template typescript
```

Let's add some improvements to the application's aidbox port and project structure:

- Rename `aidbox-docker-compose` directory to `aidbox-project`
- Replace aidbox port in the .env file:

```diff
...
- AIDBOX_PORT=8888
+ AIDBOX_PORT=8080
...
```

You should end up with this file structure:

```
main-directory
├── aidbox-project
│   ├── docker-compose.yaml
│   ├── .env
│   ├── pgdata
│   ├── zen-package.edn
│   └── zrc
└── frontend
    ├── .gitignore
    ├── node_modules
    ├── package.json
    ├── public
    ├── README.md
    ├── src
    ├── tsconfig.json
    └── yarn.lock
```

Delete unused files in `frontend/src/` so all you have left are these:

```
src
├── App.tsx
├── index.css
├── index.tsx
└── react-app-env.d.ts
```

Replace the code in `App.tsx` with the code:

```typescript
export function App() {
  return <div>App</div>;
}
```

Replace the code in `index.tsx` with the code:

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

At this step the setup is over.

## ...